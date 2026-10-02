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

export async function handleVlessWebSocket(
  request: Request,
  env: ProxyEnv,
  ctx: MinimalExecutionContext
): Promise<Response> {
  const upgradeHeader = request.headers.get("Upgrade");
  if (!upgradeHeader || upgradeHeader.toLowerCase() !== "websocket") {
    return renderCamouflageResponse();
  }

  const pair = new WebSocketPair();
  const clientWs = pair[0] as WebSocket;
  const serverWs = pair[1] as WebSocket;
  serverWs.accept();

  // Handle connection lifecycle asynchronously
  ctx.waitUntil(
    (async () => {
      let outbound: OutboundConnection | null = null;
      let userUuid = "";
      let bytesIn = 0;
      let bytesOut = 0;
      let isClosed = false;

      const cleanup = async () => {
        if (isClosed) return;
        isClosed = true;

        if (outbound) {
          try {
            await outbound.close();
          } catch {
            // ignore
          }
          outbound = null;
        }

        try {
          serverWs.close();
        } catch {
          // ignore
        }

        const totalBytes = bytesIn + bytesOut;
        if (totalBytes > 0 && userUuid) {
          try {
            await incrementUsedBytes(env.DB, userUuid, totalBytes);
          } catch (err) {
            console.error("Failed to update user traffic usage:", err);
          }
        }
      };

      try {
        // Wait for first message containing VLESS handshake
        const firstMessage = await new Promise<ArrayBuffer | Uint8Array | null>(
          (resolve) => {
            const onMessage = (event: MessageEvent) => {
              serverWs.removeEventListener("message", onMessage);
              serverWs.removeEventListener("close", onClose);
              serverWs.removeEventListener("error", onError);
              if (event.data instanceof ArrayBuffer) {
                resolve(event.data);
              } else if (ArrayBuffer.isView(event.data)) {
                resolve(event.data as Uint8Array);
              } else {
                resolve(null);
              }
            };
            const onClose = () => resolve(null);
            const onError = () => resolve(null);

            serverWs.addEventListener("message", onMessage);
            serverWs.addEventListener("close", onClose);
            serverWs.addEventListener("error", onError);
          }
        );

        if (!firstMessage) {
          await cleanup();
          return;
        }

        const rawData =
          firstMessage instanceof Uint8Array
            ? firstMessage
            : new Uint8Array(firstMessage);

        const header = parseVlessHeader(rawData);
        if (!header) {
          await cleanup();
          return;
        }

        userUuid = header.uuid;

        // Validate UUID against active cached users
        const activeUuids = await getCachedActiveUuids(env.DB);
        if (!activeUuids.has(userUuid.toLowerCase())) {
          await cleanup();
          return;
        }

        // Establish outbound TCP connection
        try {
          outbound = await createOutboundConnection(
            header.address,
            header.port,
            env.DB
          );
        } catch (err) {
          console.error(`Failed to connect to ${header.address}:${header.port}:`, err);
          await cleanup();
          return;
        }

        const writer = outbound.writable.getWriter();

        // Send initial raw payload from first chunk if present
        if (header.rawPayload.byteLength > 0) {
          bytesIn += header.rawPayload.byteLength;
          await writer.write(header.rawPayload);
        }

        // 1. Pipe client WebSocket -> remote TCP
        serverWs.addEventListener("message", async (evt: MessageEvent) => {
          if (isClosed) return;
          try {
            let chunk: Uint8Array | null = null;
            if (evt.data instanceof ArrayBuffer) {
              chunk = new Uint8Array(evt.data);
            } else if (ArrayBuffer.isView(evt.data)) {
              chunk = new Uint8Array(
                evt.data.buffer,
                evt.data.byteOffset,
                evt.data.byteLength
              );
            }
            if (chunk && chunk.byteLength > 0) {
              bytesIn += chunk.byteLength;
              await writer.write(chunk);
            }
          } catch (err) {
            await cleanup();
          }
        });

        serverWs.addEventListener("close", () => {
          cleanup();
        });

        serverWs.addEventListener("error", () => {
          cleanup();
        });

        // 2. Pipe remote TCP -> client WebSocket
        const reader = outbound.readable.getReader();
        let isFirstResponseChunk = true;

        while (!isClosed) {
          const { value, done } = await reader.read();
          if (done || !value) {
            break;
          }

          bytesOut += value.byteLength;

          // Backpressure check on WebSocket buffer
          if (serverWs.bufferedAmount > 128 * 1024) {
            while (serverWs.bufferedAmount > 32 * 1024 && !isClosed) {
              await new Promise((r) => setTimeout(r, 20));
            }
          }

          if (isFirstResponseChunk) {
            isFirstResponseChunk = false;
            const respHeader = createVlessResponseHeader();
            const combined = new Uint8Array(
              respHeader.byteLength + value.byteLength
            );
            combined.set(respHeader, 0);
            combined.set(value, respHeader.byteLength);
            serverWs.send(combined);
          } else {
            serverWs.send(value);
          }
        }

        await cleanup();
      } catch (err) {
        console.error("Proxy session exception:", err);
        await cleanup();
      }
    })()
  );

  return new Response(null, {
    status: 101,
    webSocket: clientWs,
  });
}
