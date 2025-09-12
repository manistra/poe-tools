import { LiveSearchDetails, LiveSearchWithSocket } from "src/shared/types";
import { persistentStore } from "src/shared/store/sharedStore";

export default class WsStore {
  static liveSearches: LiveSearchWithSocket[] = [];

  static add(connectionDetails: LiveSearchDetails) {
    this.liveSearches.push({
      ...connectionDetails,
      socket: null,
    });
  }

  static update(id: string, data: Partial<LiveSearchWithSocket>) {
    const index = this.liveSearches.findIndex(
      (liveSearch) => liveSearch.id === id
    );

    if (index === -1) {
      return;
    }

    // Create a new object to avoid extensibility issues
    const existing = this.liveSearches[index];
    this.liveSearches[index] = {
      ...existing,
      ...data,
    } as LiveSearchWithSocket;
  }

  static find(id: string) {
    return this.liveSearches.find((liveSearch) => liveSearch.id === id);
  }

  static remove(id: string) {
    const index = this.liveSearches.findIndex(
      (liveSearch) => liveSearch.id === id
    );

    this.liveSearches.splice(index, 1);
  }

  static sanitized() {
    return this.liveSearches.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ socket, ...remainingSocketDetails }) => remainingSocketDetails
    );
  }

  static clear() {
    // https://stackoverflow.com/a/1232046/9599137
    this.liveSearches.splice(0, this.liveSearches.length);
  }

  static set(liveSearches: LiveSearchDetails[]) {
    // Create new objects to avoid extensibility issues with frozen objects from persistent store
    this.liveSearches = liveSearches.map((liveSearch) => ({
      ...liveSearch,
      socket: null,
    }));
  }

  static load() {
    const state = persistentStore.getState();

    const liveSearches = state.liveSearches;

    // Clear existing searches first
    this.clear();

    // Add each search as a new object to avoid extensibility issues
    liveSearches.forEach((searchDetails) => {
      this.add(searchDetails);
    });
  }
}
