import { persistentStore } from "src/shared/sharedStore";

export const getPoeSessionId = () => {
  return persistentStore.getState().poeSessionid;
};
