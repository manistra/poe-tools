// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electron", {
  websocket: {
    connect: (wsUri: string, sessionId: string) => {
      ipcRenderer.send("ws-connect", { wsUri, sessionId });
    },
    disconnect: () => {
      ipcRenderer.send("ws-disconnect");
    },
    onConnected: (callback: () => void) => {
      ipcRenderer.on("ws-connected", callback);
      return () => {
        ipcRenderer.removeListener("ws-connected", callback);
      };
    },
    onDisconnected: (callback: () => void) => {
      ipcRenderer.on("ws-disconnected", callback);
      return () => {
        ipcRenderer.removeListener("ws-disconnected", callback);
      };
    },
    onMessage: (callback: (data: any) => void) => {
      const wrappedCallback = (_event: any, data: any) => callback(data);
      ipcRenderer.on("ws-message", wrappedCallback);
      return () => {
        ipcRenderer.removeListener("ws-message", wrappedCallback);
      };
    },
    onError: (callback: (error: string) => void) => {
      const wrappedCallback = (_event: any, error: string) => callback(error);
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
});
