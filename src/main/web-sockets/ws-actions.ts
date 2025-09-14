import { persistentStore } from "src/shared/store/sharedStore";
import { LiveSearchWithSocket, WebSocketState } from "src/shared/types";
import { Mutex } from "async-mutex";
import Bottleneck from "bottleneck";
import { randomInt } from "src/shared/utils/randomInt";
import WsStore from "./ws-store";
import getWebSocketUri from "../utils/getWebSocketUri";
import { WebSocket } from "ws";
import { processItems } from "../poe-trade/processItems";
import { apiHeaders } from "../utils/apiHeaders";

class WsRequestLimiter {
  static bottleneck = new Bottleneck({
    maxConcurrent: 1,
    minTime: randomInt(2200, 2500),
  });

  static schedule(cb: () => Promise<void>) {
    // Remove the isCancelled check since we're using AbortController
    return this.bottleneck.schedule(() => cb());
  }

  static async cancelAll(): Promise<void> {
    await this.bottleneck.stop({ dropWaitingJobs: true });
    // Recreate the bottleneck to allow future operations
    this.bottleneck = new Bottleneck({
      maxConcurrent: 1,
      minTime: randomInt(2200, 2500),
    });
    persistentStore.addLog(
      "[WsRequestLimiter] All queued WebSocket operations cancelled and limiter recreated"
    );
  }

  static getQueuedCount(): number {
    return this.bottleneck.queued();
  }

  static async getRunningCount(): Promise<number> {
    return await this.bottleneck.running();
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

export const connect = async (id: string, signal?: AbortSignal) =>
  ConcurrentConnectionMutex.acquire().then(async (release) => {
    const liveSearchDetails = WsStore.find(id);

    persistentStore.addLog(
      `[WebSocket] Starting connection to ${liveSearchDetails?.label}`
    );

    if (!liveSearchDetails) {
      persistentStore.addLog(`[WebSocket] No connection found: id=${id}`);
      return release();
    }

    if (
      liveSearchDetails.socket &&
      liveSearchDetails.socket.readyState !== WebSocket.CLOSED
    ) {
      persistentStore.addLog(
        `[WebSocket] Connection already open: ${liveSearchDetails.label}`
      );
      return release();
    }

    // Check abort signal before starting
    if (signal?.aborted) {
      persistentStore.addLog(
        `[WebSocket] Connection cancelled before start: ${liveSearchDetails.label}`
      );
      return release();
    }

    try {
      return await WsRequestLimiter.schedule(async () => {
        // Check abort signal before limiter execution
        if (signal?.aborted) {
          persistentStore.addLog(
            `[WebSocket] Connection cancelled in limiter: ${liveSearchDetails.label}`
          );
          return;
        }

        const webSocketUri = getWebSocketUri(liveSearchDetails.url);
        const game = webSocketUri.includes("poe2") ? "poe2" : "poe";

        persistentStore.addLog(
          `[WebSocket] Connecting to ${liveSearchDetails.label}`
        );

        // Update state immediately to CONNECTING
        updateWsConnectionState(
          liveSearchDetails.id,
          WebSocketState.CONNECTING
        );

        liveSearchDetails.socket = new WebSocket(webSocketUri, {
          headers: Object.assign(apiHeaders(true), {
            Origin: "https://www.pathofexile.com",
          }),
        });

        // Check abort signal after creating socket
        if (signal?.aborted) {
          persistentStore.addLog(
            `[WebSocket] Connection cancelled after socket creation: ${liveSearchDetails.label}`
          );
          liveSearchDetails.socket.close();
          return;
        }

        // Update the store with the socket reference
        WsStore.update(liveSearchDetails.id, {
          socket: liveSearchDetails.socket,
        });

        liveSearchDetails.socket.on("open", () => {
          persistentStore.addLog(
            `[WebSocket] Socket open - ${liveSearchDetails.label}`
          );

          heartbeat(liveSearchDetails);

          updateWsConnectionState(
            liveSearchDetails.id,
            liveSearchDetails?.socket?.readyState
          );
        });

        liveSearchDetails.socket.on("message", (response) => {
          const parsedResponse = JSON.parse(response.toString());

          const itemIds = parsedResponse.new;
          if (itemIds?.length || itemIds?.length > 0)
            persistentStore.addLog(
              `[WebSocket] Socket message received: Found ${itemIds?.length} items - ${liveSearchDetails.label}`
            );
          if (itemIds) {
            processItems(itemIds, game, liveSearchDetails);
          }
        });

        liveSearchDetails.socket.on("ping", () => {
          console.log(
            `[WS] SOCKET PING - ${liveSearchDetails.url} / ${liveSearchDetails.id}`
          );

          heartbeat(liveSearchDetails);
        });

        liveSearchDetails.socket.on("error", (error) => {
          const errorMessage = error?.message || "Unknown error";
          persistentStore.addLog(
            `[WebSocket] Socket error - ${liveSearchDetails.label} - ${errorMessage}`
          );

          const [reason, code] = errorMessage.split(": ");
          if (code && reason)
            persistentStore.updateLiveSearch(liveSearchDetails.id, {
              ws: {
                ...liveSearchDetails.ws,
                error: {
                  code: parseInt(code, 10),
                  reason,
                },
              },
            });

          updateWsConnectionState(
            liveSearchDetails.id,
            liveSearchDetails?.socket?.readyState
          );

          liveSearchDetails.socket?.close();
        });

        liveSearchDetails.socket.on("close", () => {
          const errorInfo =
            liveSearchDetails.ws?.error?.code ||
            liveSearchDetails.ws?.error?.reason
              ? ` [Code: ${liveSearchDetails.ws?.error?.code} | Reason: ${liveSearchDetails.ws?.error?.reason}]`
              : "";

          persistentStore.addLog(
            `[WebSocket] Socket close - ${liveSearchDetails.label}${errorInfo}`
          );

          updateWsConnectionState(
            liveSearchDetails.id,
            liveSearchDetails?.socket?.readyState
          );

          if (liveSearchDetails.ws?.error?.code === 429) {
            persistentStore.addLog(
              `[WebSocket] Rate limit exceded! Closing connection - ${liveSearchDetails.label}.`
            );
            return;
          }

          if (liveSearchDetails.ws?.error?.code === 404) {
            persistentStore.addLog(
              `[WebSocket] Search not found. Closing connection - ${liveSearchDetails.label}.`
            );
            return;
          }

          if (liveSearchDetails.ws?.error?.code === 401) {
            persistentStore.addLog(
              `[WebSocket] Unauthorized. Closing connection - ${liveSearchDetails.label}. Check Session ID.`
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
    } catch (error) {
      if (
        error instanceof Error &&
        error.message?.includes("This limiter has been stopped")
      ) {
        persistentStore.addLog(
          `[WebSocket] Connection cancelled due to limiter stop: ${liveSearchDetails.label}`
        );
        return release();
      }
      throw error;
    }
  });

export const disconnect = async (id: string) => {
  const liveSearchDetails = WsStore.find(id);

  if (!liveSearchDetails) {
    persistentStore.addLog(
      `[WebSocket] No disconnect initiated (no such object in store) - ${id}`
    );
    return false;
  }

  if (
    liveSearchDetails.socket &&
    (liveSearchDetails.socket.readyState === WebSocket.OPEN ||
      liveSearchDetails.socket.readyState === WebSocket.CONNECTING)
  ) {
    persistentStore.addLog(
      `[WebSocket] Disconnect initiated - ${liveSearchDetails.label}`
    );

    // Update state to CLOSING before closing
    updateWsConnectionState(liveSearchDetails.id, WebSocketState.CLOSING);

    liveSearchDetails.socket.close();
    persistentStore.addLog(
      `[WebSocket] Disconnect closed - ${liveSearchDetails.label}`
    );
  } else if (!liveSearchDetails.socket) {
    persistentStore.addLog(
      `[WebSocket] No disconnect initiated (no socket) - ${liveSearchDetails.label}`
    );
    return false;
  } else {
    persistentStore.addLog(
      `[WebSocket] No disconnect initiated (socket in wrong state) - ${liveSearchDetails.label} - ${liveSearchDetails.socket.readyState}`
    );

    return false;
  }

  return true;
};

let connectAllController: AbortController | null = null;

const connectAll = async () => {
  // Cancel any existing connectAll operation
  if (connectAllController) {
    connectAllController.abort();
  }

  connectAllController = new AbortController();
  const signal = connectAllController.signal;

  persistentStore.addLog(`[WebSocket] Connecting all sockets`);

  return await Promise.all(
    WsStore.liveSearches.map(async (liveSearch) => {
      if (signal.aborted) {
        throw new Error("Connection cancelled");
      }
      return await connect(liveSearch.id, signal); // Pass the signal
    })
  );
};

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

export const cancelAllQueues = async () => {
  persistentStore.addLog("[QueueManager] Cancelling all queued operations");

  // Cancel the connectAll operation
  if (connectAllController) {
    connectAllController.abort();
  }

  await WsRequestLimiter.cancelAll();
  // Import HttpRequestLimiter dynamically to avoid circular dependencies
  const { default: HttpRequestLimiter } = await import(
    "../api/HttpRequestLimiter"
  );
  await HttpRequestLimiter.cancelAll();
};

export const getQueueStatus = async () => {
  const wsQueued = WsRequestLimiter.getQueuedCount();
  const wsRunning = await WsRequestLimiter.getRunningCount();

  return {
    ws: { queued: wsQueued, running: wsRunning },
  };
};
