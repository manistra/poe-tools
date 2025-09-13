import { persistentStore } from "src/shared/store/sharedStore";

const cookieHeader = (useWebSocketSessionId = false) => {
  const poeSessionId = persistentStore.getState().poeSessionid;
  const webSocketSessionId = persistentStore.getState().webSocketSessionId;

  if (useWebSocketSessionId) {
    if (!webSocketSessionId) {
      return `POESESSID=${poeSessionId}`;
    }

    return `POESESSID=${webSocketSessionId}`;
  }

  return `POESESSID=${poeSessionId}`;
};

export const apiHeaders = (useWebSocketSessionId = false) => {
  return {
    "Content-Type": "application/json",
    Cookie: cookieHeader(useWebSocketSessionId),
    "User-Agent": "manistra/poe-tools",
  };
};
