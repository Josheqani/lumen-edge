import { getAllSettings } from "../db/settings";
import type { AppSettings } from "../db/types";

export interface OutboundConnection {
  readable: ReadableStream<Uint8Array>;
  writable: WritableStream<Uint8Array>;
  close: () => Promise<void> | void;
}

type ConnectFn = (address: { hostname: string; port: number }) => {
  readable: ReadableStream<Uint8Array>;
  writable: WritableStream<Uint8Array>;
  close: () => Promise<void>;
};

async function getSocketsConnect(): Promise<ConnectFn> {
  const mod = await import("cloudflare:sockets");
  return mod.connect;
}

export async function createDirectConnection(
  hostname: string,
  port: number
): Promise<OutboundConnection> {
  const connect = await getSocketsConnect();
  const socket = connect({ hostname, port });
  return {
    readable: socket.readable,
    writable: socket.writable,
    close: async () => {
      try {
        await socket.close();
      } catch {
        // ignore close errors
      }
    },
  };
}

async function readExact(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  needed: number
): Promise<Uint8Array> {
  const buffer = new Uint8Array(needed);
  let received = 0;

  while (received < needed) {
    const { value, done } = await reader.read();
    if (done || !value) {
      throw new Error(`Connection closed before reading ${needed} bytes`);
    }
    const toCopy = Math.min(value.length, needed - received);
    buffer.set(value.subarray(0, toCopy), received);
    received += toCopy;
    if (toCopy < value.length) {
      // In SOCKS5 handshake, server responses are small and arrive together,
      // but in case of extra bytes in first chunk, we don't expect them before connect request
    }
  }
  return buffer;
}

export async function createSocks5Connection(
  targetHost: string,
  targetPort: number,
  socks5Host: string,
  socks5Port: number,
  username?: string,
  password?: string
): Promise<OutboundConnection> {
  const connect = await getSocketsConnect();
  const socket = connect({ hostname: socks5Host, port: socks5Port });
  const writer = socket.writable.getWriter();
  const reader = socket.readable.getReader();

  try {
    // 1. Greeting
    const hasAuth = !!(username && password);
    const greeting = hasAuth
      ? new Uint8Array([0x05, 0x02, 0x00, 0x02]) // SOCKS5, 2 methods: 0x00 (no auth), 0x02 (user/pass)
      : new Uint8Array([0x05, 0x01, 0x00]); // SOCKS5, 1 method: 0x00 (no auth)

    await writer.write(greeting);

    // Read server selection
    const methodResp = await readExact(reader, 2);
    if (methodResp[0] !== 0x05) {
      throw new Error("Invalid SOCKS5 server version response");
    }
    const chosenMethod = methodResp[1];

    if (chosenMethod === 0x02 && hasAuth) {
      // Username / Password auth (RFC 1929)
      const uBytes = new TextEncoder().encode(username!);
      const pBytes = new TextEncoder().encode(password!);
      const authPacket = new Uint8Array(3 + uBytes.length + pBytes.length);
      authPacket[0] = 0x01; // auth version 1
      authPacket[1] = uBytes.length;
      authPacket.set(uBytes, 2);
      authPacket[2 + uBytes.length] = pBytes.length;
      authPacket.set(pBytes, 3 + uBytes.length);

      await writer.write(authPacket);

      const authResp = await readExact(reader, 2);
      if (authResp[0] !== 0x01 || authResp[1] !== 0x00) {
        throw new Error("SOCKS5 authentication failed");
      }
    } else if (chosenMethod !== 0x00) {
      throw new Error(`SOCKS5 method ${chosenMethod} not supported`);
    }

    // 2. Connect request
    // Determine address type
    const isIpv4 = /^(\d{1,3}\.){3}\d{1,3}$/.test(targetHost);
    let connectReq: Uint8Array;

    if (isIpv4) {
      const parts = targetHost.split(".").map(Number);
      connectReq = new Uint8Array(10);
      connectReq[0] = 0x05;
      connectReq[1] = 0x01; // CMD: CONNECT
      connectReq[2] = 0x00; // RSV
      connectReq[3] = 0x01; // ATYP: IPv4
      connectReq[4] = parts[0]!;
      connectReq[5] = parts[1]!;
      connectReq[6] = parts[2]!;
      connectReq[7] = parts[3]!;
      new DataView(connectReq.buffer).setUint16(8, targetPort, false);
    } else {
      // Domain
      const dBytes = new TextEncoder().encode(targetHost);
      connectReq = new Uint8Array(4 + 1 + dBytes.length + 2);
      connectReq[0] = 0x05;
      connectReq[1] = 0x01; // CONNECT
      connectReq[2] = 0x00; // RSV
      connectReq[3] = 0x03; // ATYP: Domain
      connectReq[4] = dBytes.length;
      connectReq.set(dBytes, 5);
      new DataView(connectReq.buffer).setUint16(5 + dBytes.length, targetPort, false);
    }

    await writer.write(connectReq);

    // Read connection reply header
    const repHead = await readExact(reader, 4);
    if (repHead[0] !== 0x05 || repHead[1] !== 0x00) {
      throw new Error(`SOCKS5 connect failed with reply code: ${repHead[1]}`);
    }

    const bndAtyp = repHead[3];
    if (bndAtyp === 0x01) {
      await readExact(reader, 4 + 2); // 4 bytes IPv4 + 2 bytes port
    } else if (bndAtyp === 0x03) {
      const lenBuf = await readExact(reader, 1);
      await readExact(reader, lenBuf[0]! + 2);
    } else if (bndAtyp === 0x04) {
      await readExact(reader, 16 + 2); // IPv6 + port
    }

    // Release reader/writer lock so the socket streams can be piped normally
    writer.releaseLock();
    reader.releaseLock();

    return {
      readable: socket.readable,
      writable: socket.writable,
      close: async () => {
        try {
          await socket.close();
        } catch {
          // ignore
        }
      },
    };
  } catch (err) {
    writer.releaseLock();
    reader.releaseLock();
    try {
      await socket.close();
    } catch {
      // ignore
    }
    throw err;
  }
}

export async function createOutboundConnection(
  targetHost: string,
  targetPort: number,
  db: D1Database
): Promise<OutboundConnection> {
  let settings: AppSettings | null = null;
  try {
    settings = await getAllSettings(db);
  } catch {
    // fallback to direct if settings query fails
  }

  const mode = settings?.outbound_mode ?? "direct";

  if (mode === "socks5" && settings?.socks5_config?.host && settings?.socks5_config?.port) {
    try {
      return await createSocks5Connection(
        targetHost,
        targetPort,
        settings.socks5_config.host,
        settings.socks5_config.port,
        settings.socks5_config.username,
        settings.socks5_config.password
      );
    } catch (err) {
      console.warn("SOCKS5 outbound connection failed, falling back to direct:", err);
      return createDirectConnection(targetHost, targetPort);
    }
  }

  // Fallback / default is direct
  return createDirectConnection(targetHost, targetPort);
}
