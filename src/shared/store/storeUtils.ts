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

// Helper functions for localStorage persistence
export const loadStateFromStorage = (): Partial<AppState> => {
  try {
    const poeSessionid =
      localStorage.getItem(STORAGE_KEYS.POE_SESSION_ID) || "";
    const liveSearches = JSON.parse(
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
      liveSearches,
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
      localStorage.setItem(
        STORAGE_KEYS.LIVE_SEARCHES,
        JSON.stringify(state.liveSearches)
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
