import { ipcRenderer } from "electron";
import { LiveSearchDetails } from "src/shared/types";
import { WS_EVENTS } from "src/shared/ws-events";

// WebSocket API
export const websocketAPI = {
  setAll: (liveSearchDetails: LiveSearchDetails[]) =>
    ipcRenderer.send(WS_EVENTS.WS_SET_ALL, liveSearchDetails),

  add: (liveSearchDetails: LiveSearchDetails) =>
    ipcRenderer.send(WS_EVENTS.WS_ADD, liveSearchDetails),
  update: (id: string, liveSearchDetails: Partial<LiveSearchDetails>) =>
    ipcRenderer.send(WS_EVENTS.WS_UPDATE, { id, liveSearchDetails }),
  remove: (liveSearchDetails: LiveSearchDetails) =>
    ipcRenderer.send(WS_EVENTS.WS_REMOVE, liveSearchDetails),

  connectAll: () => ipcRenderer.send(WS_EVENTS.CONNECT_ALL),
  disconnectAll: () => ipcRenderer.send(WS_EVENTS.DISCONNECT_ALL),

  connect: (id: string) => ipcRenderer.send(WS_EVENTS.WS_CONNECT_SOCKET, id),
  disconnect: (id: string) =>
    ipcRenderer.send(WS_EVENTS.WS_DISCONNECT_SOCKET, id),
};
