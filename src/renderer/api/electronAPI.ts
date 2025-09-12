import { ipcRenderer } from "electron";
import { websocketAPI } from "./websocketsApi";

// API request handler
export const apiRequest = (options: {
  url: string;
  method: string;
  headers?: Record<string, string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  params?: Record<string, string>;
}) => {
  return ipcRenderer.invoke("api-request", options);
};

// API request handler no limiter
export const apiRequestNoLimiter = (options: {
  url: string;
  method: string;
  headers?: Record<string, string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  params?: Record<string, string>;
}) => {
  return ipcRenderer.invoke("api-request-no-limiter", options);
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

// Rate limiter API
export const rateLimiterAPI = {
  getCurrentTokens: () => ipcRenderer.invoke("get-rate-limiter-tokens"),
};

// Auto teleport API
export const autoTeleportAPI = {
  teleport: (request: {
    itemId: string;
    hideoutToken: string;
    searchQueryId?: string;
  }) => ipcRenderer.invoke("auto-teleport", request),
};

// Combined API object for easy access
export const electronAPI = {
  websocket: websocketAPI,
  api: {
    request: apiRequest,
    requestNoLimiter: apiRequestNoLimiter,
  },
  updates: updatesAPI,
  shell: shellAPI,
  rateLimiter: rateLimiterAPI,
  autoTeleport: autoTeleportAPI,
};
