export interface ElectronAPI {
  websocket: {
    connect: (wsUri: string, sessionId: string, searchId: string) => void;
    disconnect: (searchId?: string) => void;
    onConnected: (callback: (searchId: string) => void) => () => void;
    onDisconnected: (callback: (searchId: string) => void) => () => void;
    onMessage: (callback: (searchId: string, data: any) => void) => () => void;
    onError: (
      callback: (searchId: string, error: string) => void
    ) => () => void;
  };
  api: {
    request: (options: {
      url: string;
      method: string;
      headers?: Record<string, string>;
      data?: any;
      params?: Record<string, string>;
    }) => Promise<any>;
    getPoeSessionId: () => Promise<string | null>;
  };
  updates: {
    getAppVersion: () => Promise<string>;
    onUpdateStatus: (callback: (status: string) => void) => () => void;
  };
  shell: {
    openExternal: (url: string) => Promise<void>;
  };
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

// Force TypeScript to recompile this file
