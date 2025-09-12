/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ElectronAPI {
  websocket: {
    setAll: (liveSearchDetails: any[]) => Promise<any>;
    deleteAll: () => Promise<any>;
    add: (liveSearchDetails: Omit<any, "id">) => Promise<any>;
    update: (id: string, liveSearchDetails: Partial<any>) => Promise<any>;
    remove: (liveSearchDetails: any) => Promise<any>;
    connectAll: () => Promise<void>;
    disconnectAll: () => Promise<void>;
    connect: (id: string) => Promise<void>;
    disconnect: (id: string) => Promise<void>;
    cancelAllAndDisconnect: () => Promise<{
      success: boolean;
      message: string;
      error?: string;
    }>;
  };
  api: {
    request: (options: {
      url: string;
      method: string;
      headers?: Record<string, string>;
      data?: any;
      params?: Record<string, string>;
    }) => Promise<any>;
    requestNoLimiter: (options: {
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
