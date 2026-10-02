export interface VlessHeader {
  version: number;
  uuid: string;
  command: number; // 1 = TCP, 2 = UDP, 3 = Mux
  port: number;
  addressType: number; // 1 = IPv4, 2 = Domain, 3 = IPv6
  address: string;
  rawPayload: Uint8Array;
}

export function bytesToUuid(bytes: Uint8Array, offset = 0): string {
  if (bytes.length < offset + 16) {
    throw new Error("Buffer too short for UUID");
  }
  const hex: string[] = [];
  for (let i = 0; i < 16; i++) {
    const b = bytes[offset + i]!;
    hex.push((b < 16 ? "0" : "") + b.toString(16));
  }
  return [
    hex.slice(0, 4).join(""),
    hex.slice(4, 6).join(""),
    hex.slice(6, 8).join(""),
    hex.slice(8, 10).join(""),
    hex.slice(10, 16).join(""),
  ]
    .join("-")
    .toLowerCase();
}

export function parseVlessHeader(buffer: Uint8Array): VlessHeader | null {
  // Minimum length:
  // 1 (version) + 16 (uuid) + 1 (addons len) + 0 (addons) + 1 (command) + 2 (port) + 1 (addr type) = 22 bytes
  if (buffer.length < 22) {
    return null;
  }

  let offset = 0;
  const version = buffer[offset++]!;

  const uuid = bytesToUuid(buffer, offset);
  offset += 16;

  const addonsLen = buffer[offset++]!;
  offset += addonsLen; // skip proto addons if present

  if (buffer.length < offset + 4) {
    return null;
  }

  const command = buffer[offset++]!; // 1 = TCP, 2 = UDP
  const view = new DataView(buffer.buffer, buffer.byteOffset + offset, 2);
  const port = view.getUint16(0, false);
  offset += 2;

  const addressType = buffer[offset++]!;
  let address = "";

  if (addressType === 1) {
    // IPv4 (4 bytes)
    if (buffer.length < offset + 4) return null;
    address = [
      buffer[offset++]!,
      buffer[offset++]!,
      buffer[offset++]!,
      buffer[offset++]!,
    ].join(".");
  } else if (addressType === 2) {
    // Domain: 1 byte length + ASCII bytes
    if (buffer.length < offset + 1) return null;
    const domainLen = buffer[offset++]!;
    if (buffer.length < offset + domainLen) return null;
    address = new TextDecoder().decode(
      buffer.subarray(offset, offset + domainLen)
    );
    offset += domainLen;
  } else if (addressType === 3) {
    // IPv6 (16 bytes)
    if (buffer.length < offset + 16) return null;
    const parts: string[] = [];
    const ipv6View = new DataView(buffer.buffer, buffer.byteOffset + offset, 16);
    for (let i = 0; i < 8; i++) {
      parts.push(ipv6View.getUint16(i * 2, false).toString(16));
    }
    address = parts.join(":");
    offset += 16;
  } else {
    // Unsupported address type
    return null;
  }

  const rawPayload = buffer.subarray(offset);

  return {
    version,
    uuid,
    command,
    port,
    addressType,
    address,
    rawPayload,
  };
}

export function createVlessResponseHeader(): Uint8Array {
  // VLESS response header: version 0 (1 byte) + addons length 0 (1 byte)
  return new Uint8Array([0x00, 0x00]);
}
