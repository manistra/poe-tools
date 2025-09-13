import { persistentStore } from "src/shared/store/sharedStore";

export const getPoeSessionId = () => {
  return persistentStore.getState().poeSessionid;
};
