import { ipcRenderer } from "electron";
import { websocketAPI } from "./websocketsApi";
import { SoundType } from "src/shared/types";

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

// Poe Trade API
export const poeTradeAPI = {
  copyToClipboard: async (text: string) =>
    await ipcRenderer.invoke("copy-to-clipboard", text),
  teleportToHideout: (request: {
    itemId: string;
    hideoutToken: string;
    searchQueryId?: string;
  }) => ipcRenderer.invoke("auto-teleport", request),
  sendWhisper: (request: {
    itemId: string;
    token: string;
    searchQueryId?: string;
  }) => ipcRenderer.invoke("send-whisper", request),
};

// Sound API
const soundAPI = {
  playSound: (soundType: SoundType) =>
    ipcRenderer.invoke("play-sound", soundType),
};

// Screen API
const screenAPI = {
  getDisplays: () => ipcRenderer.invoke("get-displays"),
  showGridOverlay: (highlightX = 0, highlightY = 0) =>
    ipcRenderer.invoke("show-grid-overlay", highlightX, highlightY),
  hideGridOverlay: () => ipcRenderer.invoke("hide-grid-overlay"),
  updateGridPosition: (config: {
    width: string;
    height: string;
    x: string;
    y: string;
    screenIndex: number;
  }) => ipcRenderer.invoke("update-grid-position", config),
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
  poeTrade: poeTradeAPI,
  sound: soundAPI,
  screen: screenAPI,
};
