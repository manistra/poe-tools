import React, { PropsWithChildren } from "react";
import { LiveSearchContext } from "./liveSearchContext.types";
import { useLiveSearches } from "src/shared/store/hooks";

export const LiveSearchProvider = ({ children }: PropsWithChildren) => {
  const {
    liveSearches,
    addLiveSearch,
    updateLiveSearch,
    deleteLiveSearch,
    setLiveSearches,
  } = useLiveSearches();

  // TODO: Implement WebSocket connection handlers
  const handleConnectAll = () => {
    // Connect all live searches to WebSocket
  };

  const handleDisconnectAll = () => {
    // Disconnect all live searches from WebSocket
  };

  const handleConnectIndividual = (id: string) => {
    // Connect individual live search by ID to WebSocket
  };

  const handleDisconnectIndividual = (id: string) => {
    // Disconnect individual live search by ID from WebSocket
  };

  return (
    <LiveSearchContext.Provider
      value={{
        liveSearches,
        addLiveSearch,
        updateLiveSearch,
        deleteLiveSearch,
        setLiveSearches,

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
