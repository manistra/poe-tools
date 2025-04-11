import "./index.css"; // import css

import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import UpdateIndicator from "./components/UpdateIndicator";
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
        onUpdateStatus: (callback: (status: string) => void) => () => void;
      };
    };
  }
}

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
    <Toast />
    <UpdateIndicator />
  </React.StrictMode>
);
