import React, { PropsWithChildren } from "react";
import { LiveSearchContext } from "./liveSearchContext.types";
import { useLiveSearches } from "src/shared/store/hooks";
import { electronAPI } from "src/renderer/api/electronAPI";
import { LiveSearchDetails } from "src/shared/types";

export const LiveSearchProvider = ({ children }: PropsWithChildren) => {
  const { liveSearches } = useLiveSearches();

  const handleAddLiveSearch = (liveSearchDetails: LiveSearchDetails) => {
    electronAPI.websocket.add(liveSearchDetails);
  };
  const handleSetAllLiveSearches = (liveSearchDetails: LiveSearchDetails[]) => {
    electronAPI.websocket.setAll(liveSearchDetails);
  };
  const handleUpdateLiveSearch = (
    id: string,
    liveSearchDetails: Partial<LiveSearchDetails>
  ) => {
    electronAPI.websocket.update(id, liveSearchDetails);
  };
  const handleDeleteLiveSearch = (liveSearchDetails: LiveSearchDetails) => {
    electronAPI.websocket.remove(liveSearchDetails);
  };

  const handleConnectAll = () => {
    electronAPI.websocket.connectAll();
  };
  const handleDisconnectAll = () => {
    electronAPI.websocket.disconnectAll();
  };
  const handleConnectIndividual = (id: string) => {
    electronAPI.websocket.connect(id);
  };
  const handleDisconnectIndividual = (id: string) => {
    electronAPI.websocket.disconnect(id);
  };

  return (
    <LiveSearchContext.Provider
      value={{
        liveSearches,
        addLiveSearch: handleAddLiveSearch,
        updateLiveSearch: handleUpdateLiveSearch,
        deleteLiveSearch: handleDeleteLiveSearch,
        setLiveSearches: handleSetAllLiveSearches,

        ws: {
          connectAll: handleConnectAll,
          disconnectAll: handleDisconnectAll,
          connectIndividual: handleConnectIndividual,
          disconnectIndividual: handleDisconnectIndividual,
        },
      }}
    >
      {children}
    </LiveSearchContext.Provider>
  );
};
