import { LiveSearch, TransformedItemData } from "../types";
import Store from "electron-store";

export interface Log {
  message: string;
  timestamp: string;
}

export interface AppState {
  poeSessionid: string;
  liveSearches: LiveSearch[];
  results: TransformedItemData[];
  autoWhisper: boolean;
  rateLimiterTokens: number;
  logs: Log[];
}

export const initialState: AppState = {
  poeSessionid: "",
  liveSearches: [],
  results: [],
  autoWhisper: false,
  rateLimiterTokens: 6,
  logs: [],
};

// Create electron-store instance
const store = new Store<AppState>({
  name: "poe-tools-store",
  defaults: {
    poeSessionid: "",
    liveSearches: [],
    results: [],
    autoWhisper: false,
    rateLimiterTokens: 6,
    logs: [],
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
