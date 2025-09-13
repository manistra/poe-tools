import { createSharedStore } from "electron-shared-state";
import {
  AppState,
  getInitialState,
  saveStateToStorage,
  Log,
} from "./storeUtils";
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
      webSocketSessionId: "",
      lastTeleportedItem: undefined,
      liveSearches: [],
      results: [],
      autoTeleport: false,
      autoWhisper: false,
      isTeleportingBlocked: false,
      rateLimiterTokens: 6,
      rateLimitData: {
        requestLimit: 6,
        interval: 4,
      },
      logs: [],
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

  setWebSocketSessionId(sessionId: string): void {
    this.setState((state) => {
      state.webSocketSessionId = sessionId;
    });
  }

  setLastTeleportedItem(
    item: (TransformedItemData & { alreadyTeleported?: boolean }) | null
  ): void {
    this.setState((state) => {
      state.lastTeleportedItem = item;
    });
  }

  setRateLimitData(rateLimitData: {
    requestLimit: number;
    interval: number;
  }): void {
    this.setState((state) => {
      state.rateLimitData = rateLimitData;
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
            Object.entries(updates).filter(([, value]) => value !== undefined)
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

  setAutoTeleport(enabled: boolean): void {
    this.setState((state) => {
      state.autoTeleport = enabled;
    });
    this.setState((state) => {
      state.isTeleportingBlocked = false;
    });
  }

  setAutoWhisper(enabled: boolean): void {
    this.setState((state) => {
      state.autoWhisper = enabled;
    });
  }

  setIsTeleportingBlocked(blocked: boolean): void {
    this.setState((state) => {
      state.isTeleportingBlocked = blocked;
    });
  }

  setRateLimiterTokens(tokens: number): void {
    this.setState((state) => {
      state.rateLimiterTokens = tokens;
    });
  }

  // Log management methods
  addLog(message: string): void {
    const now = new Date().toISOString();

    console.log(`[${now}] - ${message}`);
    this.setState((state) => {
      const log: Log = {
        message,
        timestamp: now,
      };
      state.logs.unshift(log); // Add to beginning
      // Keep only last 1000 logs to prevent memory issues
      if (state.logs.length > 1000) {
        state.logs = state.logs.slice(0, 1000);
      }
    });
  }

  setLogs(logs: Log[]): void {
    this.setState((state) => {
      state.logs = logs;
    });
  }

  clearLogs(): void {
    this.setState((state) => {
      state.logs = [];
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
