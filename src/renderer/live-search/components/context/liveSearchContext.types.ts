import { createContext } from "react";
import { LiveSearch } from "src/shared/types";

export type LiveSearchContextType = {
  liveSearches: LiveSearch[];
  addLiveSearch: (liveSearch: Omit<LiveSearch, "id">) => void;
  updateLiveSearch: (
    id: string,
    updates: Partial<Omit<LiveSearch, "id">>
  ) => void;
  deleteLiveSearch: (id: string) => void;
  setLiveSearches: (liveSearches: LiveSearch[]) => void;

  ws: {
    connectAll: () => void;
    disconnectAll: () => void;
    connectIndividual: (id: string) => void;
    disconnectIndividual: (id: string) => void;
  };
};

export const LiveSearchContext = createContext<
  LiveSearchContextType | undefined
>(undefined);
