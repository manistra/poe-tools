import { persistentStore } from "src/shared/store/sharedStore";

const cookieHeader = () => {
  const poeSessionId = persistentStore.getState().poeSessionid;

  return `POESESSID=${poeSessionId}`;
};

export const apiHeaders = () => {
  return {
    "Content-Type": "application/json",
    Cookie: cookieHeader(),
    "User-Agent": "manistra/poe-tools",
  };
};
