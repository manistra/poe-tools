// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electron", {
  websocket: {
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
  },
  api: {
    request: (options: {
      url: string;
      method: string;
      headers?: Record<string, string>;
      data?: any;
      params?: Record<string, string>;
    }) => {
      return ipcRenderer.invoke("api-request", options);
    },
    getPoeSessionId: () => {
      return ipcRenderer.invoke("get-poe-session-id");
    },
  },
  updates: {
    getAppVersion: () => ipcRenderer.invoke("get-app-version"),
    onUpdateStatus: (callback: (status: string) => void) => {
      const wrappedCallback = (_event: any, status: string) => callback(status);
      ipcRenderer.on("update-status", wrappedCallback);
      return () => {
        ipcRenderer.removeListener("update-status", wrappedCallback);
      };
    },
  },
  shell: {
    openExternal: (url: string) =>
      ipcRenderer.invoke("shell-open-external", url),
  },
});
