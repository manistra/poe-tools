import React, { PropsWithChildren } from "react";
import { LiveSearchContext } from "./liveSearchContext.types";
import { useLiveSearches } from "src/shared/store/hooks";
import { electronAPI } from "src/renderer/api/electronAPI";
import { LiveSearchDetails } from "src/shared/types";

export const LiveSearchProvider = ({ children }: PropsWithChildren) => {
  const { liveSearches } = useLiveSearches();

  const handleAddLiveSearch = (
    liveSearchDetails: Omit<LiveSearchDetails, "id">
  ) => {
    electronAPI.websocket.add(liveSearchDetails);
  };
  const handleImportLiveSearches = (liveSearchDetails: LiveSearchDetails[]) => {
    electronAPI.websocket.setAll(liveSearchDetails);
  };
  const handleDeleteAllLiveSearches = async () => {
    await electronAPI.websocket.deleteAll();
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

  const handleConnectAll = async () => {
    await electronAPI.websocket.connectAll();
  };
  const handleDisconnectAll = async () => {
    await electronAPI.websocket.disconnectAll();
  };
  const handleConnectIndividual = async (id: string) => {
    await electronAPI.websocket.connect(id);
  };
  const handleDisconnectIndividual = async (id: string) => {
    await electronAPI.websocket.disconnect(id);
  };

  const handleCancelAllAndDisconnect = async () => {
    await electronAPI.websocket.cancelAllAndDisconnect();
  };

  return (
    <LiveSearchContext.Provider
      value={{
        liveSearches,
        addLiveSearch: handleAddLiveSearch,
        updateLiveSearch: handleUpdateLiveSearch,
        deleteLiveSearch: handleDeleteLiveSearch,
        importLiveSearches: handleImportLiveSearches,
        deleteAllLiveSearches: handleDeleteAllLiveSearches,

        ws: {
          connectAll: handleConnectAll,
          disconnectAll: handleDisconnectAll,
          connectIndividual: handleConnectIndividual,
          disconnectIndividual: handleDisconnectIndividual,
          cancelAllAndDisconnect: handleCancelAllAndDisconnect,
        },
      }}
    >
      {children}
    </LiveSearchContext.Provider>
  );
};
