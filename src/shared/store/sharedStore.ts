import { createSharedStore } from "electron-shared-state";
import { AppState, getInitialState, saveStateToStorage } from "./storeUtils";
import { LiveSearch, TransformedItemData } from "../types";

// Create the shared store with initial state loaded from localStorage
const sharedStore = createSharedStore<AppState>(getInitialState(), {
  name: "poe-tools-store",
});

// Enhanced store with localStorage persistence
export class PersistentSharedStore {
  private store = sharedStore;
  private isRenderer = typeof window !== "undefined";

  constructor() {
    // Set up automatic persistence to localStorage
    this.store.subscribe((state) => {
      if (this.isRenderer) {
        // Only save to localStorage from renderer process
        saveStateToStorage(state);
      }
    });
  }

  // Get current state synchronously
  getState(): AppState {
    return this.store.getState();
  }

  // Subscribe to state changes
  subscribe(callback: (state: AppState) => void): () => void {
    return this.store.subscribe(callback);
  }

  // Update state with automatic persistence
  setState(updater: (state: AppState) => void): void {
    this.store.setState(updater);
  }

  // Convenience methods for specific state updates
  setPoeSessionId(sessionId: string): void {
    this.setState((state) => {
      state.poeSessionid = sessionId;
    });
  }

  setLiveSearches(liveSearches: LiveSearch[]): void {
    this.setState((state) => {
      state.liveSearches = liveSearches;
    });
  }

  addLiveSearch(liveSearch: Omit<LiveSearch, "id">): LiveSearch {
    const newLiveSearch: LiveSearch = {
      ...liveSearch,
      id: `search-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    this.setState((state) => {
      state.liveSearches.push(newLiveSearch);
    });

    return newLiveSearch;
  }

  updateLiveSearch(id: string, updates: Partial<Omit<LiveSearch, "id">>): void {
    this.setState((state) => {
      const liveSearchIndex = state.liveSearches.findIndex(
        (liveSearch) => liveSearch.id === id
      );
      if (liveSearchIndex !== -1) {
        state.liveSearches[liveSearchIndex] = {
          ...state.liveSearches[liveSearchIndex],
          ...updates,
        };
      }
    });
  }

  deleteLiveSearch(id: string): void {
    this.setState((state) => {
      state.liveSearches = state.liveSearches.filter(
        (liveSearch) => liveSearch.id !== id
      );
    });
  }

  setResults(results: TransformedItemData[]): void {
    this.setState((state) => {
      state.results = results;
    });
  }

  addResult(result: TransformedItemData): void {
    this.setState((state) => {
      state.results.unshift(result); // Add to beginning
      // Keep only last 200 results to prevent memory issues
      if (state.results.length > 200) {
        state.results = state.results.slice(0, 200);
      }
    });
  }

  clearResults(): void {
    this.setState((state) => {
      state.results = [];
    });
  }

  setAutoWhisper(enabled: boolean): void {
    this.setState((state) => {
      state.autoWhisper = enabled;
    });
  }

  setRateLimiterTokens(tokens: number): void {
    this.setState((state) => {
      state.rateLimiterTokens = tokens;
    });
  }

  // Reset to initial state
  reset(): void {
    this.setState((state) => {
      Object.assign(state, getInitialState());
    });
  }
}

// Export singleton instance
export const persistentStore = new PersistentSharedStore();

// Export the raw store for direct access if needed
export { sharedStore };
