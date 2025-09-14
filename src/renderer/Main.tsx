import "./index.css"; // import css

import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { LiveSearchProvider } from "./live-search/context/LiveSearchContext";

import Toast from "./components/Toast";

declare global {
  interface Window {
    electron: {
      api: {
        request: (options: {
          url: string;
          method: string;
          headers?: Record<string, string>;
          data?: any;
          params?: Record<string, string>;
        }) => Promise<any>;
      };
      websocket: {
        connect: (wsUri: string, sessionId: string) => void;
        disconnect: () => void;
        onConnected: (callback: () => void) => () => void;
        onDisconnected: (callback: () => void) => () => void;
        onMessage: (callback: (data: any) => void) => () => void;
        onError: (callback: (error: string) => void) => () => void;
      };
      updates: {
        getAppVersion: () => Promise<string>;
        checkForUpdates: () => Promise<{
          success: boolean;
          message: string;
          version?: string;
        }>;
        onUpdateStatus: (callback: (status: string) => void) => () => void;
      };
      shell: {
        openExternal: (url: string) => Promise<boolean>;
      };
    };
  }
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <LiveSearchProvider>
      <App />
      <Toast />
    </LiveSearchProvider>
  </React.StrictMode>
);
