import { createSharedStore } from "electron-shared-state";
import { AppState, getInitialState, saveStateToStorage } from "./storeUtils";
import { SearchConfig, TransformedItemData } from "../types";

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

  setSearchConfigs(configs: SearchConfig[]): void {
    this.setState((state) => {
      state.searchConfigs = configs;
    });
  }

  addSearchConfig(config: Omit<SearchConfig, "id">): SearchConfig {
    const newConfig: SearchConfig = {
      ...config,
      id: `search-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    this.setState((state) => {
      state.searchConfigs.push(newConfig);
    });

    return newConfig;
  }

  updateSearchConfig(
    id: string,
    updates: Partial<Omit<SearchConfig, "id">>
  ): void {
    this.setState((state) => {
      const configIndex = state.searchConfigs.findIndex(
        (config) => config.id === id
      );
      if (configIndex !== -1) {
        state.searchConfigs[configIndex] = {
          ...state.searchConfigs[configIndex],
          ...updates,
        };
      }
    });
  }

  deleteSearchConfig(id: string): void {
    this.setState((state) => {
      state.searchConfigs = state.searchConfigs.filter(
        (config) => config.id !== id
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
      // Keep only last 1000 results to prevent memory issues
      if (state.results.length > 1000) {
        state.results = state.results.slice(0, 1000);
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
