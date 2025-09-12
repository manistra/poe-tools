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
    connectAll: () => Promise<void>;
    disconnectAll: () => Promise<void>;
    connectIndividual: (id: string) => Promise<void>;
    disconnectIndividual: (id: string) => void;
  };
};

export const LiveSearchContext = createContext<
  LiveSearchContextType | undefined
>(undefined);
