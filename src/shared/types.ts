export interface LiveSearch {
  id: string;
  label: string; // This maps to 'name' in the original implementation
  url: string; // This maps to 'searchUrl' in the original implementation
  // WebSocket instance - the actual WebSocket connection
  isConnected?: boolean; // This maps to 'isConnected' in the original implementation
  socket?: WebSocket | null; // Can be null when not connected

  // Error state - only present when WebSocket errors occur
  error?: {
    code: number;
    reason: string;
  };

  // Custom properties added by the application
  pingTimeout?: NodeJS.Timeout; // Timeout ID for heartbeat mechanism
}

export interface ItemData {
  id: string;
  time: string;
  item: {
    icon?: string;
    sockets: unknown;
    name: string;
    typeLine: string;
    properties: {
      name: string;
      values: [string, number][];
      displayMode: number;
      type?: number;
    }[];
    explicitMods?: string[];
    runeMods?: string[];
    fracturedMods?: string[];
    corrupted?: boolean;
    extended: {
      pdps: number;
      edps: number;
      dps: number;
    };
  };
  pingedAt: string;
  searchLabel?: string;
  listing?: {
    indexed: string;
    account: {
      name: string;
    };
    price: {
      amount: number;
      currency: string;
    };
    whisper?: string;
    hideout_token?: string;
    stash?: {
      x: number;
      y: number;
    };
  };
}

export interface TransformedItemData {
  pingedAt: string;
  id: string;
  name: string;
  typeLine: string;
  time: string;
  listedAt: string;
  explicitMods?: string[];
  runeMods?: string[];
  fracturedMods?: string[];
  corrupted?: boolean;
  runeSockets?: number;
  seller?: string;
  price?: {
    amount: number;
    currency: string;
  };
  whisper?: string;
  hideoutToken?: string;
  searchQueryId?: string;
  searchLabel?: string;

  stash?: {
    x: number;
    y: number;
  };
  icon?: string;
}

export interface ApiResponse {
  data?: any;
  error?: {
    message: string;
    status: number;
    headers: Record<string, string>;
  };
  status?: number;
  headers?: Record<string, string>;
}
