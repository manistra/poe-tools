import { useContext } from "react";

import { LiveSearchContext } from "../liveSearchContext.types";

export const useLiveSearchContext = () => {
  const ctx = useContext(LiveSearchContext);
  if (!ctx)
    throw new Error(
      "useLiveSearchContext must be used within LiveSearchProvider"
    );
  return ctx;
};
