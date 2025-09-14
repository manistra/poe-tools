import { WebSocket as WsWebSocket } from "ws";

export enum WebSocketState {
  OPEN = 1,
  CONNECTING = 0,
  CLOSED = 3,
  CLOSING = 2,
}

export interface CurrencyCondition {
  currency: Poe2Currency;
  minPrice?: number;
  maxPrice?: number;
}

export interface LiveSearch {
  id: string;
  label: string; // This maps to 'name' in the original implementation
  url: string; // This maps to 'searchUrl' in the original implementation
  currencyConditions?: CurrencyCondition[];

  ws?: {
    // Runtime state properties
    error?: {
      // Optional - only present when WebSocket errors occur
      code: number;
      reason: string;
      // Computed connection state - derived from socket.readyState
    };
    readyState?: WebSocketState | null; // WebSocket.OPEN | CONNECTING | CLOSED | CLOSING
  };
}
export type LiveSearchDetails = Omit<LiveSearch, "ws">;

export interface LiveSearchWithSocket extends LiveSearch {
  socket?: WsWebSocket | null;
  pingTimeout?: NodeJS.Timeout | null;
}

export interface ItemData {
  id: string;
  time: string;
  item: {
    icon?: string;
    sockets: unknown;
    name: string;
    typeLine: string;
    rarity: string;
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
    whisper_token?: string;
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
  rarity: string;
  time: string;
  listedAt?: string;
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
  isWhispered?: boolean;
  whisper?: string;
  whisper_token?: string;
  hideoutToken?: string;
  searchQueryId?: string;
  searchLabel?: string;

  stash?: {
    x?: number;
    y?: number;
  };
  icon?: string;
}

export interface ApiResponse {
  data?: unknown;
  error?: {
    message: string;
    status: number;
    headers: Record<string, string>;
  };
  status?: number;
  headers?: Record<string, string>;
}

export type Poe2Currency =
  | "alch"
  | "annul"
  | "aug"
  | "chaos"
  | "divine"
  | "exalted"
  | "mirror"
  | "regal"
  | "transmute"
  | "vaal";
