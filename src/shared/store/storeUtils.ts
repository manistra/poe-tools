import { LiveSearch, TransformedItemData } from "../types";

export interface AppState {
  poeSessionid: string;
  liveSearches: LiveSearch[];
  results: TransformedItemData[];
  autoWhisper: boolean;
  rateLimiterTokens: number;
}

export const initialState: AppState = {
  poeSessionid: "",
  liveSearches: [],
  results: [],
  autoWhisper: false,
  rateLimiterTokens: 6,
};

// Storage keys for localStorage
const STORAGE_KEYS = {
  POE_SESSION_ID: "poeSessionId",
  LIVE_SEARCHES: "poe-live-searches",
  RESULTS: "poe-results",
  AUTO_WHISPER: "poe-auto-whisper",
  RATE_LIMITER_TOKENS: "poe-rate-limiter-tokens",
} as const;

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

// Helper functions for localStorage persistence
export const loadStateFromStorage = (): Partial<AppState> => {
  try {
    const poeSessionid =
      localStorage.getItem(STORAGE_KEYS.POE_SESSION_ID) || "";
    const liveSearchDetails = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.LIVE_SEARCHES) || "[]"
    );
    const results = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.RESULTS) || "[]"
    );
    const autoWhisper =
      localStorage.getItem(STORAGE_KEYS.AUTO_WHISPER) === "true";
    const rateLimiterTokens = parseInt(
      localStorage.getItem(STORAGE_KEYS.RATE_LIMITER_TOKENS) || "6"
    );

    return {
      poeSessionid,
      liveSearches: liveSearchDetails as LiveSearch[],
      results,
      autoWhisper,
      rateLimiterTokens,
    };
  } catch (error) {
    console.error("Error loading state from localStorage:", error);
    return {};
  }
};

export const saveStateToStorage = (state: Partial<AppState>): void => {
  try {
    if (state.poeSessionid !== undefined) {
      localStorage.setItem(STORAGE_KEYS.POE_SESSION_ID, state.poeSessionid);
    }
    if (state.liveSearches !== undefined) {
      // Sanitize liveSearches to remove ws property before saving
      const sanitizedLiveSearches = sanitizeLiveSearchesForPersistence(
        state.liveSearches
      );
      localStorage.setItem(
        STORAGE_KEYS.LIVE_SEARCHES,
        JSON.stringify(sanitizedLiveSearches)
      );
    }
    if (state.results !== undefined) {
      localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(state.results));
    }
    if (state.autoWhisper !== undefined) {
      localStorage.setItem(
        STORAGE_KEYS.AUTO_WHISPER,
        state.autoWhisper.toString()
      );
    }
    if (state.rateLimiterTokens !== undefined) {
      localStorage.setItem(
        STORAGE_KEYS.RATE_LIMITER_TOKENS,
        state.rateLimiterTokens.toString()
      );
    }
  } catch (error) {
    console.error("Error saving state to localStorage:", error);
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
