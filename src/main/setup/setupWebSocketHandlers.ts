import { ipcMain } from "electron";
import { persistentStore } from "../../shared/store/sharedStore";
import WsStore from "../web-sockets/ws-store";
import * as webSocketActions from "../web-sockets/ws-actions";
import { LiveSearch, LiveSearchDetails } from "../../shared/types";
import { WS_EVENTS } from "src/shared/ws-events";

export const setupWebSocketHandlers = () => {
  ipcMain.on(
    WS_EVENTS.WS_SET_ALL,
    (event, liveSearchDetails: LiveSearchDetails[]) => {
      console.log("[WS] Setting all connections");

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
          `[WS] Unable to set all connections, some connections are open or connecting or closing`
        );
        return;
      }

      WsStore.set(liveSearchDetails);
      persistentStore.setLiveSearches(liveSearchDetails);
    }
  );

  ipcMain.on(
    WS_EVENTS.WS_ADD,
    (event, liveSearchDetails: LiveSearchDetails) => {
      console.log(`[WS] Adding connection: ${liveSearchDetails.label}`);

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
    }
  );

  ipcMain.on(
    WS_EVENTS.WS_REMOVE,
    (event, liveSearchDetails: LiveSearchDetails) => {
      console.log(
        `[WS] Removing connection: ${liveSearchDetails.id} - ${liveSearchDetails.label}`
      );

      // Disconnect the WebSocket first
      webSocketActions.disconnect(liveSearchDetails.id);

      // Remove from store
      WsStore.remove(liveSearchDetails.id);

      // Use the proper delete method instead of overwriting the entire array
      persistentStore.deleteLiveSearch(liveSearchDetails.id);
    }
  );

  ipcMain.on(
    WS_EVENTS.WS_UPDATE,
    (
      event,
      {
        id,
        liveSearchDetails,
      }: { id: string; liveSearchDetails: Partial<LiveSearchDetails> }
    ) => {
      console.log(`[WS] Updating connection: ${id}`);

      const ws = WsStore.find(id);

      if (!ws) {
        console.log(`[WS] No connection found: ${id}`);
        return;
      }

      if (
        ws.socket != null &&
        (ws.socket.readyState === WebSocket.OPEN ||
          ws.socket.readyState === WebSocket.CONNECTING)
      ) {
        console.log(
          `[WS] Unable to edit connection open: ${liveSearchDetails.id} - ${liveSearchDetails.label}`
        );
        return;
      }

      WsStore.update(id, {
        ...ws,
        ...liveSearchDetails,
      });

      persistentStore.setLiveSearches(WsStore.sanitized());
    }
  );

  ipcMain.on(WS_EVENTS.CONNECT_ALL, () => {
    console.log(`[WS] Reconnecting all sockets`);
    webSocketActions.reconnectAll();
  });

  ipcMain.on(WS_EVENTS.DISCONNECT_ALL, () => {
    console.log(`[WS] Disconnecting all sockets`);
    webSocketActions.disconnectAll();
  });

  ipcMain.on(WS_EVENTS.WS_CONNECT_SOCKET, (event, id: string) => {
    console.log(`[WS] Connecting: ${id}`);

    webSocketActions.connect(id);
  });

  ipcMain.on(WS_EVENTS.WS_DISCONNECT_SOCKET, (event, id: string) => {
    console.log(`[WS] Disconnecting: ${id}`);

    webSocketActions.disconnect(id);
  });
};
