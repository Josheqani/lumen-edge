import { incrementUsedBytes } from "../db/users";
import { getCachedActiveUuids } from "./cache";
import { renderCamouflageResponse } from "./camouflage";
import { createOutboundConnection, type OutboundConnection } from "./outbound";
import { createVlessResponseHeader, parseVlessHeader } from "./vless";

export interface ProxyEnv {
  DB: D1Database;
  WS_PATH?: string;
  PANEL_PATH?: string;
}

export interface MinimalExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
}

function decodeEarlyData(protocolHeader: string | null): Uint8Array | null {
  if (!protocolHeader) return null;
  try {
    let b64 = protocolHeader.replace(/-/g, "+").replace(/_/g, "/");
    const pad = b64.length % 4;
    if (pad) {
      b64 += "=".repeat(4 - pad);
    }
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch {
    return null;
  }
}

function safeCloseWebSocket(ws: WebSocket) {
  try {
    if (ws.readyState === 1 || ws.readyState === 2) {
      ws.close();
    }
  } catch {
    // ignore
  }
}

function makeReadableWebSocketStream(
  webSocket: WebSocket,
  earlyData: Uint8Array | null
): ReadableStream<Uint8Array> {
  let isCanceled = false;
  return new ReadableStream<Uint8Array>({
    start(controller) {
      webSocket.addEventListener("message", (event: MessageEvent) => {
        if (isCanceled) return;
        const msg = event.data;
        if (msg instanceof ArrayBuffer) {
          controller.enqueue(new Uint8Array(msg));
        } else if (ArrayBuffer.isView(msg)) {
          controller.enqueue(
            new Uint8Array(msg.buffer, msg.byteOffset, msg.byteLength)
          );
        }
      });

      webSocket.addEventListener("close", () => {
        if (isCanceled) return;
        safeCloseWebSocket(webSocket);
        try {
          controller.close();
        } catch {
          // ignore
        }
      });

      webSocket.addEventListener("error", (err) => {
        if (isCanceled) return;
        safeCloseWebSocket(webSocket);
        try {
          controller.error(err);
        } catch {
          // ignore
        }
      });

      if (earlyData && earlyData.byteLength > 0) {
        controller.enqueue(earlyData);
      }
    },
    cancel() {
      if (isCanceled) return;
      isCanceled = true;
      safeCloseWebSocket(webSocket);
    },
  });
}

export async function handleVlessWebSocket(
  request: Request,
  env: ProxyEnv,
  ctx: MinimalExecutionContext
): Promise<Response> {
  const upgradeHeader = request.headers.get("Upgrade");
  if (!upgradeHeader || upgradeHeader.toLowerCase() !== "websocket") {
    return renderCamouflageResponse();
  }

  const earlyDataHeader = request.headers.get("sec-websocket-protocol");
  const earlyData = decodeEarlyData(earlyDataHeader);

  const pair = new WebSocketPair();
  const clientWs = pair[0] as WebSocket;
  const serverWs = pair[1] as WebSocket;
  serverWs.accept();

  // Create stream immediately to capture all incoming WebSocket packets without delay
  const readableWs = makeReadableWebSocketStream(serverWs, earlyData);

  // Execute proxy pipeline asynchronously in worker context
  ctx.waitUntil(
    (async () => {
      let outbound: OutboundConnection | null = null;
      let userUuid = "";
      let bytesIn = 0;
      let bytesOut = 0;
      let isDns = false;
      let vlessHeaderSent = false;
      const vlessResponseHeader = createVlessResponseHeader();

      const recordTraffic = async () => {
        const totalBytes = bytesIn + bytesOut;
        if (totalBytes > 0 && userUuid) {
          try {
            await incrementUsedBytes(env.DB, userUuid, totalBytes);
          } catch (err) {
            console.error("Traffic accounting error:", err);
          }
        }
      };

      const cleanup = async () => {
        if (outbound) {
          try {
            await outbound.close();
          } catch {
            // ignore
          }
          outbound = null;
        }
        safeCloseWebSocket(serverWs);
        await recordTraffic();
      };

      const handleDnsChunk = async (rawClientData: Uint8Array) => {
        for (let offset = 0; offset < rawClientData.byteLength; ) {
          if (rawClientData.byteLength < offset + 2) break;
          const udpPacketLen =
            (rawClientData[offset]! << 8) | rawClientData[offset + 1]!;
          offset += 2;
          if (rawClientData.byteLength < offset + udpPacketLen) break;
          const dnsQuery = rawClientData.subarray(offset, offset + udpPacketLen);
          offset += udpPacketLen;

          try {
            const resp = await fetch("https://1.1.1.1/dns-query", {
              method: "POST",
              headers: { "content-type": "application/dns-message" },
              body: dnsQuery,
            });
            const dnsResult = new Uint8Array(await resp.arrayBuffer());
            const resLen = dnsResult.byteLength;
            const lenBuf = new Uint8Array([(resLen >> 8) & 0xff, resLen & 0xff]);
            bytesOut += resLen;

            if (serverWs.readyState === 1) {
              if (!vlessHeaderSent) {
                vlessHeaderSent = true;
                const out = new Uint8Array(2 + 2 + resLen);
                out.set(vlessResponseHeader, 0);
                out.set(lenBuf, 2);
                out.set(dnsResult, 4);
                serverWs.send(out);
              } else {
                const out = new Uint8Array(2 + resLen);
                out.set(lenBuf, 0);
                out.set(dnsResult, 2);
                serverWs.send(out);
              }
            }
          } catch (err) {
            console.warn("DNS over HTTPS resolution error:", err);
          }
        }
      };

      try {
        await readableWs.pipeTo(
          new WritableStream({
            async write(chunk) {
              bytesIn += chunk.byteLength;

              // If DNS stream is active, route all subsequent packets through DoH
              if (isDns) {
                await handleDnsChunk(chunk);
                return;
              }

              // If TCP outbound connection is already open, forward chunk
              if (outbound) {
                const writer = outbound.writable.getWriter();
                try {
                  await writer.write(chunk);
                } finally {
                  writer.releaseLock();
                }
                return;
              }

              // Otherwise this is the first chunk containing the VLESS header
              const header = parseVlessHeader(chunk);
              if (!header) {
                throw new Error("Invalid VLESS header format");
              }

              userUuid = header.uuid;

              // Validate user UUID against active users in cache/D1
              const activeUuids = await getCachedActiveUuids(env.DB);
              if (!activeUuids.has(userUuid.toLowerCase())) {
                throw new Error(`Unauthorized user UUID: ${userUuid}`);
              }

              // Handle UDP queries
              if (header.command === 2) {
                if (header.port === 53) {
                  isDns = true;
                  if (header.rawPayload.byteLength > 0) {
                    await handleDnsChunk(header.rawPayload);
                  }
                  return;
                } else {
                  throw new Error(`Unsupported UDP port ${header.port}`);
                }
              }

              // Handle Backend VPS Outbound mode
              let settings = null;
              try {
                const { getAllSettings } = await import("../db/settings");
                settings = await getAllSettings(env.DB);
              } catch {
                // ignore
              }

              if (
                settings?.outbound_mode === "backend" &&
                settings.backend_config?.url
              ) {
                try {
                  const resp = await fetch(settings.backend_config.url, {
                    headers: { Upgrade: "websocket" },
                  });
                  const backendWs = resp.webSocket;
                  if (backendWs) {
                    backendWs.accept();
                    backendWs.send(chunk);

                    let backendClosed = false;
                    const closeAll = async () => {
                      if (backendClosed) return;
                      backendClosed = true;
                      safeCloseWebSocket(backendWs);
                      await cleanup();
                    };

                    serverWs.addEventListener("message", (e: MessageEvent) => {
                      if (backendClosed) return;
                      const d = e.data;
                      const len =
                        d instanceof ArrayBuffer
                          ? d.byteLength
                          : ArrayBuffer.isView(d)
                          ? d.byteLength
                          : 0;
                      bytesIn += len;
                      backendWs.send(d);
                    });
                    serverWs.addEventListener("close", closeAll);
                    serverWs.addEventListener("error", closeAll);

                    backendWs.addEventListener("message", (e: MessageEvent) => {
                      if (backendClosed) return;
                      const d = e.data;
                      const len =
                        d instanceof ArrayBuffer
                          ? d.byteLength
                          : ArrayBuffer.isView(d)
                          ? d.byteLength
                          : 0;
                      bytesOut += len;
                      serverWs.send(d);
                    });
                    backendWs.addEventListener("close", closeAll);
                    backendWs.addEventListener("error", closeAll);
                    return;
                  }
                } catch (err) {
                  console.warn("Backend VPS relay failed, falling back to direct:", err);
                }
              }

              // Establish TCP outbound connection (Direct, SOCKS5, or ProxyIP)
              outbound = await createOutboundConnection(
                header.address,
                header.port,
                env.DB
              );

              // Send initial payload (e.g. TLS Client Hello or HTTP GET)
              if (header.rawPayload.byteLength > 0) {
                const writer = outbound.writable.getWriter();
                try {
                  await writer.write(header.rawPayload);
                } finally {
                  writer.releaseLock();
                }
              }

              // Pipe outbound readable back to client serverWs
              const remoteReader = outbound.readable.getReader();
              ctx.waitUntil(
                (async () => {
                  try {
                    while (true) {
                      const { value, done } = await remoteReader.read();
                      if (done || !value) break;

                      bytesOut += value.byteLength;

                      if (serverWs.readyState !== 1) break;

                      if (!vlessHeaderSent) {
                        vlessHeaderSent = true;
                        const combined = new Uint8Array(
                          vlessResponseHeader.byteLength + value.byteLength
                        );
                        combined.set(vlessResponseHeader, 0);
                        combined.set(value, vlessResponseHeader.byteLength);
                        serverWs.send(combined);
                      } else {
                        serverWs.send(value);
                      }
                    }
                  } catch {
                    // ignore read error on connection close
                  } finally {
                    try {
                      remoteReader.releaseLock();
                    } catch {}
                    await cleanup();
                  }
                })()
              );
            },
            close() {
              cleanup();
            },
            abort() {
              cleanup();
            },
          })
        );
      } catch (err) {
        console.error("VLESS session error:", err);
        await cleanup();
      }
    })()
  );

  return new Response(null, {
    status: 101,
    webSocket: clientWs,
    headers: {
      "Sec-WebSocket-Extensions": "",
    },
  });
}
