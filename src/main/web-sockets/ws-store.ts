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

  static update(id: string, data: LiveSearchDetails) {
    const index = this.liveSearches.findIndex(
      (liveSearch) => liveSearch.id === id
    );

    this.liveSearches[index] = {
      ...this.liveSearches[index],
      ...data,
    };
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
    // https://stackoverflow.com/a/1232046/9599137
    this.liveSearches = liveSearches;
  }

  static load() {
    const state = persistentStore.getState();

    console.log("Loading WS Store");
    console.log(state);

    const liveSearches = state.liveSearches;

    liveSearches.forEach((searchDetails) => {
      this.add(searchDetails);
    });
  }
}
