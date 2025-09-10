import { ipcRenderer } from "electron";

// WebSocket API
export const websocketAPI = {
  connect: (wsUri: string, sessionId: string, searchId: string) => {
    ipcRenderer.send("ws-connect", { wsUri, sessionId, searchId });
  },
  disconnect: (searchId?: string) => {
    ipcRenderer.send("ws-disconnect", searchId);
  },
  onConnected: (callback: (searchId: string) => void) => {
    const wrappedCallback = (_event: any, searchId: string) =>
      callback(searchId);
    ipcRenderer.on("ws-connected", wrappedCallback);
    return () => {
      ipcRenderer.removeListener("ws-connected", wrappedCallback);
    };
  },
  onDisconnected: (callback: (searchId: string) => void) => {
    const wrappedCallback = (_event: any, searchId: string) =>
      callback(searchId);
    ipcRenderer.on("ws-disconnected", wrappedCallback);
    return () => {
      ipcRenderer.removeListener("ws-disconnected", wrappedCallback);
    };
  },
  onMessage: (callback: (searchId: string, data: any) => void) => {
    const wrappedCallback = (_event: any, searchId: string, data: any) =>
      callback(searchId, data);
    ipcRenderer.on("ws-message", wrappedCallback);
    return () => {
      ipcRenderer.removeListener("ws-message", wrappedCallback);
    };
  },
  onError: (callback: (searchId: string, error: string) => void) => {
    const wrappedCallback = (_event: any, searchId: string, error: string) =>
      callback(searchId, error);
    ipcRenderer.on("ws-error", wrappedCallback);
    return () => {
      ipcRenderer.removeListener("ws-error", wrappedCallback);
    };
  },
};

// API request handler
export const apiRequest = (options: {
  url: string;
  method: string;
  headers?: Record<string, string>;
  data?: any;
  params?: Record<string, string>;
}) => {
  return ipcRenderer.invoke("api-request", options);
};

// Updates API
export const updatesAPI = {
  getAppVersion: () => ipcRenderer.invoke("get-app-version"),
  onUpdateStatus: (callback: (status: string) => void) => {
    const wrappedCallback = (_event: any, status: string) => callback(status);
    ipcRenderer.on("update-status", wrappedCallback);
    return () => {
      ipcRenderer.removeListener("update-status", wrappedCallback);
    };
  },
};

// Shell API
export const shellAPI = {
  openExternal: (url: string) => ipcRenderer.invoke("shell-open-external", url),
};

// Combined API object for easy access
export const electronAPI = {
  websocket: websocketAPI,
  api: {
    request: apiRequest,
  },
  updates: updatesAPI,
  shell: shellAPI,
};
