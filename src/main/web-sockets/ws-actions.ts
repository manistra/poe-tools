import { persistentStore } from "src/shared/store/sharedStore";
import { LiveSearchWithSocket } from "src/shared/types";
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
  liveSearch: LiveSearchWithSocket
) => {
  persistentStore.updateLiveSearch(id, {
    ws: {
      readyState: liveSearch.socket?.readyState ?? WebSocket.CLOSED,
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

export const connect = (id: string) =>
  ConcurrentConnectionMutex.acquire().then((release) => {
    const ws = WsStore.find(id);

    if (!ws) return release();

    if (ws.socket && ws.socket.readyState !== WebSocket.CLOSED)
      return release();

    return WsRequestLimiter.schedule(async () => {
      const webSocketUri = getWebSocketUri(ws.url);
      const game = webSocketUri.includes("poe2") ? "poe2" : "poe";

      console.log(`[WS] Connecting to id:  ${ws.label} - ${ws.id}`);

      ws.socket = new WebSocket(webSocketUri, {
        headers: Object.assign(apiHeaders(), {
          Origin: "https://www.pathofexile.com",
        }),
      });

      WsStore.update(ws.id, {
        ...ws,
      });

      ws.socket.on("open", () => {
        console.log(`[WS] SOCKET OPEN - ${ws.url} / ${ws.id}`);

        heartbeat(ws);

        updateWsConnectionState(ws.id, ws);
      });

      ws.socket.on("message", (response) => {
        console.log(`[WS] SOCKET MESSAGE - ${ws.url} / ${ws.id} - ${response}`);
        const parsedResponse = JSON.parse(response.toString());

        const itemIds = parsedResponse.new;

        if (itemIds) {
          processItems(itemIds, game);
        }
      });

      ws.socket.on("ping", () => {
        console.log(`[WS] SOCKET PING - ${ws.url} / ${ws.id}`);

        heartbeat(ws);
      });

      ws.socket.on("error", (error) => {
        const errorMessage = error?.message || "Unknown error";
        console.log(`[WS] SOCKET ERROR - ${ws.url} / ${ws.id} ${errorMessage}`);

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

        updateWsConnectionState(ws.id, ws);

        ws.socket?.close();
      });

      ws.socket.on("close", () => {
        console.log(
          `[WS] SOCKET CLOSE - ${ws.url} / ${ws.id} ${ws.ws?.error?.code} ${ws.ws?.error?.reason}`
        );

        updateWsConnectionState(ws.id, ws);

        if (ws.ws?.error?.code === 429) {
          console.log(
            `[WS] Rate limit exceded! Closing connection for ${ws.url}. This should not happen, please open an issue.`
          );
          return;
        }

        if (ws.ws?.error?.code === 404) {
          console.log(
            `[WS] Search not found. Closing connection for ${ws.url}.`
          );
          return;
        }

        if (ws.ws?.error?.code === 401) {
          console.log(
            `[WS] Unauthorized. Closing connection for ${ws.url}. Check Session ID.`
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

export const disconnect = (id: string) => {
  const ws = WsStore.find(id);

  if (!ws) {
    console.log(
      `[WS] No disconnect initiated (no such object in store) - ${id}`
    );
    return;
  }

  if (
    ws.socket &&
    (ws.socket.readyState === WebSocket.OPEN ||
      ws.socket.readyState === WebSocket.CONNECTING)
  ) {
    console.log(`[WS] Disconnect initiated - ${id}`);
    ws.socket.close();

    updateWsConnectionState(ws.id, ws);
  } else if (!ws.socket) {
    console.log(`[WS] No disconnect initiated (no socket) - ${id}`);
  } else {
    console.log(
      `No disconnect initiated (socket in wrong state) - ${ws.socket.readyState}`
    );
  }
};

const connectAll = () =>
  WsStore.liveSearches.forEach((liveSearch) => connect(liveSearch.id));

export const disconnectAll = () =>
  WsStore.liveSearches.forEach((liveSearch) => disconnect(liveSearch.id));

export const reconnectAll = () => {
  disconnectAll();
  // Disconnect triggers a re-connect in case the socket was already open.
  // In case sockets were not open before we also call connect
  connectAll();
};
