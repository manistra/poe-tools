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
});
