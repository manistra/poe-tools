import { LiveSearch, SoundType, TransformedItemData } from "../types";
import Store from "electron-store";

export interface Log {
  message: string;
  timestamp: string;
}

export interface GridConfig {
  width: string;
  height: string;
  x: string;
  y: string;
  screenIndex: number;
  enabled?: boolean;
}

export interface ShowGridOverlayParams {
  width: string;
  height: string;
  x: string;
  y: string;
  screenIndex: number;
  highlightX: number;
  highlightY: number;
}

export interface AppState {
  poeSessionid: string;
  webSocketSessionId: string;

  liveSearches: LiveSearch[];
  results: TransformedItemData[];

  lastTeleportedItem?:
    | (TransformedItemData & { alreadyTeleported?: boolean })
    | null;
  autoTeleport: boolean;
  autoWhisper: boolean;
  isTeleportingBlocked: boolean;

  disableSounds: boolean;
  rateLimitData: {
    requestLimit: number;
    interval: number;
  };
  rateLimiterTokens: number;
  logs: Log[];

  selectedSounds?: {
    whisper?: SoundType | "none";
    teleport?: SoundType | "none";
    ping?: SoundType | "none";
  };

  gridConfig: GridConfig;
}

export const initialState: AppState = {
  poeSessionid: "",
  webSocketSessionId: "",

  liveSearches: [],
  results: [],

  lastTeleportedItem: undefined,
  autoTeleport: false,
  autoWhisper: false,
  isTeleportingBlocked: false,

  disableSounds: false,
  rateLimiterTokens: 6,
  rateLimitData: {
    requestLimit: 6,
    interval: 4,
  },

  logs: [],

  selectedSounds: {
    whisper: "evo_item",
    teleport: "evo_item",
    ping: "evo_item",
  },

  gridConfig: {
    width: "674",
    height: "674",
    x: "331",
    y: "237",
    screenIndex: 1,
    enabled: false,
  },
};

// Create electron-store instance
const store = new Store<AppState>({
  name: "poe-tools-store",
  defaults: {
    poeSessionid: "",
    webSocketSessionId: "",

    liveSearches: [],
    results: [],

    lastTeleportedItem: undefined,
    autoTeleport: false,
    autoWhisper: false,
    isTeleportingBlocked: false,

    disableSounds: false,
    rateLimiterTokens: 6,
    rateLimitData: {
      requestLimit: 6,
      interval: 4,
    },

    logs: [],

    selectedSounds: {
      whisper: "whisper",
      teleport: "teleport",
      ping: "ping",
    },

    gridConfig: {
      width: "674",
      height: "674",
      x: "331",
      y: "237",
      screenIndex: 0,
      enabled: false,
    },
  },
});

// Helper function to sanitize liveSearches by removing non-persistable ws properties
const sanitizeLiveSearchesForPersistence = (
  liveSearches: LiveSearch[]
): Omit<LiveSearch, "ws">[] => {
  return liveSearches.map((liveSearch) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ws, ...details } = liveSearch;

    return details;
  });
};

// Helper functions for electron-store persistence
export const loadStateFromStorage = (): Partial<AppState> => {
  try {
    return store.store;
  } catch (error) {
    console.error("Error loading state from electron-store:", error);
    return {};
  }
};

export const saveStateToStorage = (state: Partial<AppState>): void => {
  try {
    // Sanitize liveSearches to remove ws property before saving
    const sanitizedState = {
      ...state,
      ...(state.liveSearches !== undefined && {
        liveSearches: sanitizeLiveSearchesForPersistence(state.liveSearches),

        lastTeleportedItem: null,
        isTeleportingBlocked: false,
      }),
    };

    store.set(sanitizedState);
  } catch (error) {
    console.error("Error saving state to electron-store:", error);
  }
};

// Helper function to merge loaded state with initial state
export const getInitialState = (): AppState => {
  const loadedState = loadStateFromStorage();
  return {
    ...initialState,
    ...loadedState,
  };
};
