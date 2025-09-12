import { ipcRenderer } from "electron";
import { LiveSearchDetails } from "src/shared/types";
import { WS_EVENTS } from "src/shared/ws-events";

// WebSocket API
export const websocketAPI = {
  setAll: (liveSearchDetails: LiveSearchDetails[]) =>
    ipcRenderer.invoke(WS_EVENTS.WS_SET_ALL, liveSearchDetails),

  add: (liveSearchDetails: Omit<LiveSearchDetails, "id">) =>
    ipcRenderer.invoke(WS_EVENTS.WS_ADD, liveSearchDetails),
  update: (id: string, liveSearchDetails: Partial<LiveSearchDetails>) =>
    ipcRenderer.invoke(WS_EVENTS.WS_UPDATE, { id, liveSearchDetails }),
  remove: (liveSearchDetails: LiveSearchDetails) =>
    ipcRenderer.invoke(WS_EVENTS.WS_REMOVE, liveSearchDetails),

  connectAll: async () => await ipcRenderer.invoke(WS_EVENTS.CONNECT_ALL),
  disconnectAll: async () => await ipcRenderer.invoke(WS_EVENTS.DISCONNECT_ALL),

  connect: async (id: string) =>
    await ipcRenderer.invoke(WS_EVENTS.WS_CONNECT_SOCKET, id),
  disconnect: async (id: string) =>
    await ipcRenderer.invoke(WS_EVENTS.WS_DISCONNECT_SOCKET, id),
};
