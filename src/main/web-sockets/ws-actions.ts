import { persistentStore } from "src/shared/store/sharedStore";
import { LiveSearchWithSocket, WebSocketState } from "src/shared/types";
import { Mutex } from "async-mutex";
import Bottleneck from "bottleneck";
import { randomInt } from "src/shared/utils/randomInt";
import WsStore from "./ws-store";
import getWebSocketUri from "./utils/getWebSocketUri";
import { WebSocket } from "ws";
import { processItems } from "./utils/processItems";
import { apiHeaders } from "./utils/apiHeaders";

class WsRequestLimiter {
  static bottleneck = new Bottleneck({
    maxConcurrent: 1,
    minTime: randomInt(2200, 2500),
  });

  static schedule(cb: () => Promise<void>) {
    return this.bottleneck.schedule(() => cb());
  }
}

class ConcurrentConnectionMutex {
  static mutex = new Mutex();

  static acquire() {
    return this.mutex.acquire();
  }
}

const serverPingTimeframeSeconds = 30;
const pingAllowedDelaySeconds = 1;

const updateWsConnectionState = (
  id: string,
  newReadyState?: WebSocketState
) => {
  persistentStore.updateLiveSearch(id, {
    ws: {
      readyState: newReadyState ?? WebSocket.CLOSED,
    },
  });
};

const heartbeat = (liveSearch: LiveSearchWithSocket) => {
  clearTimeout(liveSearch.pingTimeout ?? 0);

  // eslint-disable-next-line no-param-reassign
  liveSearch.pingTimeout = setTimeout(() => {
    liveSearch.socket?.terminate();
  }, (serverPingTimeframeSeconds + pingAllowedDelaySeconds) * 1000);
};

export const connect = async (id: string) =>
  ConcurrentConnectionMutex.acquire().then(async (release) => {
    const ws = WsStore.find(id);

    persistentStore.addLog(`[WebSocket] Starting connection to ${ws?.label}`);

    if (!ws) {
      persistentStore.addLog(`[WebSocket] No connection found: id=${id}`);

      return release();
    }

    if (ws.socket && ws.socket.readyState !== WebSocket.CLOSED) {
      persistentStore.addLog(
        `[WebSocket] Connection already open: ${ws.label}`
      );

      return release();
    }

    return await WsRequestLimiter.schedule(async () => {
      const webSocketUri = getWebSocketUri(ws.url);
      const game = webSocketUri.includes("poe2") ? "poe2" : "poe";

      persistentStore.addLog(`[WebSocket] Connecting to ${ws.label}`);

      // Update state immediately to CONNECTING
      updateWsConnectionState(ws.id, WebSocketState.CONNECTING);

      ws.socket = new WebSocket(webSocketUri, {
        headers: Object.assign(apiHeaders(), {
          Origin: "https://www.pathofexile.com",
        }),
      });

      WsStore.update(ws.id, {
        ...ws,
      });

      ws.socket.on("open", () => {
        persistentStore.addLog(`[WebSocket] Socket open - ${ws.label}`);

        heartbeat(ws);

        updateWsConnectionState(ws.id, ws?.socket?.readyState);
      });

      ws.socket.on("message", (response) => {
        const parsedResponse = JSON.parse(response.toString());

        const itemIds = parsedResponse.new;
        persistentStore.addLog(
          `[WebSocket] Socket message received: Found ${
            itemIds?.length || 0
          } items - ${ws.label}`
        );
        if (itemIds) {
          processItems(itemIds, game, ws.label);
        }
      });

      ws.socket.on("ping", () => {
        console.log(`[WS] SOCKET PING - ${ws.url} / ${ws.id}`);

        heartbeat(ws);
      });

      ws.socket.on("error", (error) => {
        const errorMessage = error?.message || "Unknown error";
        persistentStore.addLog(
          `[WebSocket] Socket error - ${ws.label} - ${errorMessage}`
        );

        const [reason, code] = errorMessage.split(": ");
        if (code && reason)
          persistentStore.updateLiveSearch(ws.id, {
            ws: {
              ...ws.ws,
              error: {
                code: parseInt(code, 10),
                reason,
              },
            },
          });

        updateWsConnectionState(ws.id, ws?.socket?.readyState);

        ws.socket?.close();
      });

      ws.socket.on("close", () => {
        const errorInfo =
          ws.ws?.error?.code || ws.ws?.error?.reason
            ? ` [Code: ${ws.ws?.error?.code} | Reason: ${ws.ws?.error?.reason}]`
            : "";

        persistentStore.addLog(
          `[WebSocket] Socket close - ${ws.label}${errorInfo}`
        );

        updateWsConnectionState(ws.id, ws?.socket?.readyState);

        if (ws.ws?.error?.code === 429) {
          persistentStore.addLog(
            `[WebSocket] Rate limit exceded! Closing connection - ${ws.label}.`
          );
          return;
        }

        if (ws.ws?.error?.code === 404) {
          persistentStore.addLog(
            `[WebSocket] Search not found. Closing connection - ${ws.label}.`
          );
          return;
        }

        if (ws.ws?.error?.code === 401) {
          persistentStore.addLog(
            `[WebSocket] Unauthorized. Closing connection - ${ws.label}. Check Session ID.`
          );
          return;
        }

        // const delay = randomInt(2000, 3000);
        // console.log(
        //   `Auto-reconnect to be initiated in ${delay / 1000} seconds - ${
        //     ws.url
        //   } / ${ws.id}`
        // );

        // setTimeout(() => connect(ws.id), delay);
      });

      return release();
    });
  });

export const disconnect = async (id: string) => {
  const ws = WsStore.find(id);

  if (!ws) {
    persistentStore.addLog(
      `[WebSocket] No disconnect initiated (no such object in store) - ${id}`
    );
    return false;
  }

  if (
    ws.socket &&
    (ws.socket.readyState === WebSocket.OPEN ||
      ws.socket.readyState === WebSocket.CONNECTING)
  ) {
    persistentStore.addLog(`[WebSocket] Disconnect initiated - ${ws.label}`);

    // Update state to CLOSING before closing
    updateWsConnectionState(ws.id, WebSocketState.CLOSING);

    ws.socket.close();
    persistentStore.addLog(`[WebSocket] Disconnect closed - ${ws.label}`);
  } else if (!ws.socket) {
    persistentStore.addLog(
      `[WebSocket] No disconnect initiated (no socket) - ${ws.label}`
    );
    return false;
  } else {
    persistentStore.addLog(
      `[WebSocket] No disconnect initiated (socket in wrong state) - ${ws.label} - ${ws.socket.readyState}`
    );

    return false;
  }

  return true;
};

const connectAll = async () =>
  await Promise.all(
    WsStore.liveSearches.map((liveSearch) => {
      persistentStore.addLog(`[WebSocket] Connecting all sockets`);
      return connect(liveSearch.id);
    })
  );

export const disconnectAll = async () =>
  await Promise.all(
    WsStore.liveSearches.map((liveSearch) => {
      persistentStore.addLog(`[WebSocket] Disconnecting all sockets`);
      return disconnect(liveSearch.id);
    })
  );

export const reconnectAll = async () => {
  persistentStore.addLog(`[WebSocket] Reconnecting all sockets`);
  await disconnectAll();
  // Disconnect triggers a re-connect in case the socket was already open.
  // In case sockets were not open before we also call connect
  await connectAll();

  return true;
};
