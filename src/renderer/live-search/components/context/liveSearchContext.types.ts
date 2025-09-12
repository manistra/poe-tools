import { createContext } from "react";
import { LiveSearch } from "src/shared/types";

export type LiveSearchContextType = {
  liveSearches: LiveSearch[];
  addLiveSearch: (liveSearchDetails: Omit<LiveSearch, "id">) => void;
  updateLiveSearch: (
    id: string,
    liveSearchDetails: Partial<Omit<LiveSearch, "id">>
  ) => void;
  deleteLiveSearch: (liveSearchDetails: LiveSearch) => void;
  setLiveSearches: (liveSearchDetails: LiveSearch[]) => void;

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
