import { setupApiHandlers } from "./setupApiHandlers";
import { setupAutoUpdater } from "./setupAutoUpdater";
import { setupWebSocketHandlers } from "./setupWebSocketHandlers";
import WsStore from "../web-sockets/ws-store";
import { persistentStore } from "../../shared/store/sharedStore";

export const initializeHandlers = () => {
  if (process.env.NODE_ENV === "development") {
    console.log("DEVELOPMENT ENVIRONMENT");
  }

  WsStore.load();

  setupApiHandlers();
  setupAutoUpdater();
  setupWebSocketHandlers();
};

export const initializeStorage = () => {
  persistentStore.initialize();

  // if (process.env.NODE_ENV === "development") {
  //   console.log("Setting mock data for development");
  //   persistentStore.setResults(
  //     [...persistentStore.getState().results, ...mockData].map(
  //       transformItemData
  //     )
  //   );
  // }
};
