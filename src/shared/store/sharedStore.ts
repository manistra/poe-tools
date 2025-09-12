import { createSharedStore } from "electron-shared-state";
import { AppState, getInitialState, saveStateToStorage } from "./storeUtils";
import { LiveSearch, TransformedItemData } from "../types";

// Create the shared store with data loaded from electron-store
const getInitialStoreState = (): AppState => {
  try {
    const loadedState = getInitialState();
    return loadedState;
  } catch (error) {
    console.error("Error loading initial state:", error);
    return {
      poeSessionid: "",
      liveSearches: [],
      results: [],
      autoWhisper: false,
      rateLimiterTokens: 6,
    };
  }
};

const sharedStore = createSharedStore<AppState>(getInitialStoreState(), {
  name: "poe-tools-store",
});

// Enhanced store with electron-store persistence
export class PersistentSharedStore {
  private store = sharedStore;

  private isInitialized = false;

  constructor() {
    // Set up automatic persistence to electron-store
    this.store.subscribe((state) => {
      if (this.isInitialized)
        // Save to electron-store from both main and renderer processes
        saveStateToStorage(state);
    });
  }

  // Initialize store (data already loaded from electron-store)
  initialize() {
    if (this.isInitialized) return;
    console.log(
      "PersistentSharedStore initialized with state:",
      this.store.getState()
    );
    this.isInitialized = true;
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

  addLiveSearch(liveSearch: LiveSearch): LiveSearch {
    this.setState((state) => {
      state.liveSearches.unshift(liveSearch); // Add to beginning
      // Keep only last 20 results to prevent memory issues
      if (state.liveSearches.length > 20) {
        state.results = state.results.slice(0, 20);
      }
    });

    return liveSearch;
  }

  updateLiveSearch(id: string, updates: Partial<Omit<LiveSearch, "id">>): void {
    this.setState((state) => {
      const liveSearchIndex = state.liveSearches.findIndex(
        (liveSearch) => liveSearch.id === id
      );
      if (liveSearchIndex !== -1) {
        const existingLiveSearch = state.liveSearches[liveSearchIndex];
        if (existingLiveSearch) {
          // Filter out undefined values from updates
          const filteredUpdates = Object.fromEntries(
            Object.entries(updates).filter(([_, value]) => value !== undefined)
          ) as Partial<Omit<LiveSearch, "id">>;

          state.liveSearches[liveSearchIndex] = {
            ...existingLiveSearch,
            ...filteredUpdates,
            id: existingLiveSearch.id, // Ensure id is never overwritten
          };
        }
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
