import { SearchConfig, TransformedItemData } from "../types";

export interface AppState {
  poeSessionid: string;
  searchConfigs: SearchConfig[];
  results: TransformedItemData[];
  autoWhisper: boolean;
  rateLimiterTokens: number;
}

export const initialState: AppState = {
  poeSessionid: "",
  searchConfigs: [],
  results: [],
  autoWhisper: false,
  rateLimiterTokens: 6,
};

// Storage keys for localStorage
const STORAGE_KEYS = {
  POE_SESSION_ID: "poeSessionId",
  SEARCH_CONFIGS: "poe-search-configs",
  RESULTS: "poe-results",
  AUTO_WHISPER: "poe-auto-whisper",
  RATE_LIMITER_TOKENS: "poe-rate-limiter-tokens",
} as const;

// Helper functions for localStorage persistence
export const loadStateFromStorage = (): Partial<AppState> => {
  try {
    const poeSessionid =
      localStorage.getItem(STORAGE_KEYS.POE_SESSION_ID) || "";
    const searchConfigs = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.SEARCH_CONFIGS) || "[]"
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
      searchConfigs,
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
    if (state.searchConfigs !== undefined) {
      localStorage.setItem(
        STORAGE_KEYS.SEARCH_CONFIGS,
        JSON.stringify(state.searchConfigs)
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
