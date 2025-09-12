import { ipcMain } from "electron";
import { persistentStore } from "../../shared/store/sharedStore";
import WsStore from "../web-sockets/ws-store";
import * as webSocketActions from "../web-sockets/ws-actions";
import { LiveSearch, LiveSearchDetails } from "../../shared/types";
import { WS_EVENTS } from "src/shared/ws-events";

export const setupWebSocketHandlers = () => {
  ipcMain.handle(
    WS_EVENTS.WS_SET_ALL,
    (event, liveSearchDetails: LiveSearchDetails[]) => {
      console.log("[WebSocket] Setting all connections");

      const wsStoreLiveSearches = WsStore.liveSearches;

      if (
        wsStoreLiveSearches.some(
          (ws) =>
            ws.socket != null &&
            (ws.socket.readyState === WebSocket.OPEN ||
              ws.socket.readyState === WebSocket.CONNECTING ||
              ws.socket.readyState === WebSocket.CLOSING)
        )
      ) {
        console.log(
          `[WebSocket] Unable to set all connections, some connections are open or connecting or closing`
        );
        return;
      }

      WsStore.set(liveSearchDetails);
      persistentStore.setLiveSearches(liveSearchDetails);

      return liveSearchDetails;
    }
  );

  ipcMain.handle(
    WS_EVENTS.WS_ADD,
    (event, liveSearchDetails: LiveSearchDetails) => {
      persistentStore.addLog(
        `[WebSocket] Adding connection: ${liveSearchDetails.label}`
      );

      const newId = `search-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      const newLiveSearch: LiveSearch = {
        ...liveSearchDetails,
        id: newId,
      };

      WsStore.add(newLiveSearch);

      // Update persistent store with sanitized connections
      persistentStore.addLiveSearch(newLiveSearch);

      persistentStore.addLog(
        `[WebSocket] Added connection: ${liveSearchDetails.label}`
      );

      return newLiveSearch;
    }
  );

  ipcMain.handle(
    WS_EVENTS.WS_REMOVE,
    (event, liveSearchDetails: LiveSearchDetails) => {
      persistentStore.addLog(
        `[WebSocket] Removing connection: ${liveSearchDetails.label}`
      );

      // Disconnect the WebSocket first
      webSocketActions.disconnect(liveSearchDetails.id);

      // Remove from store
      WsStore.remove(liveSearchDetails.id);

      // Use the proper delete method instead of overwriting the entire array
      persistentStore.deleteLiveSearch(liveSearchDetails.id);

      persistentStore.addLog(
        `[WebSocket] Removed connection: ${liveSearchDetails.label}`
      );

      return liveSearchDetails;
    }
  );

  ipcMain.handle(
    WS_EVENTS.WS_UPDATE,
    (
      event,
      {
        id,
        liveSearchDetails,
      }: { id: string; liveSearchDetails: Partial<LiveSearchDetails> }
    ) => {
      persistentStore.addLog(
        `[WebSocket] Updating connection: ${liveSearchDetails.label}`
      );

      const ws = WsStore.find(id);

      if (!ws) {
        persistentStore.addLog(
          `[WebSocket] No connection found: ${liveSearchDetails.label}`
        );
        return;
      }

      if (
        ws.socket != null &&
        (ws.socket.readyState === WebSocket.OPEN ||
          ws.socket.readyState === WebSocket.CONNECTING)
      ) {
        persistentStore.addLog(
          `[WebSocket] Unable to edit connection open: ${liveSearchDetails.label}`
        );
        return;
      }

      WsStore.update(id, {
        ...ws,
        ...liveSearchDetails,
      });

      persistentStore.setLiveSearches(WsStore.sanitized());

      persistentStore.addLog(
        `[WebSocket] Updated connection: ${liveSearchDetails.label}`
      );

      return liveSearchDetails;
    }
  );

  ipcMain.handle(WS_EVENTS.CONNECT_ALL, async () => {
    persistentStore.addLog(`[WebSocket] Reconnecting all sockets`);
    return await webSocketActions.reconnectAll();
  });

  ipcMain.handle(WS_EVENTS.DISCONNECT_ALL, async () => {
    persistentStore.addLog(`[WebSocket] Disconnecting all sockets`);
    return await webSocketActions.disconnectAll();
  });

  ipcMain.handle(WS_EVENTS.WS_CONNECT_SOCKET, async (event, id: string) => {
    return await webSocketActions.connect(id);
  });

  ipcMain.handle(WS_EVENTS.WS_DISCONNECT_SOCKET, async (event, id: string) => {
    return await webSocketActions.disconnect(id);
  });
};
