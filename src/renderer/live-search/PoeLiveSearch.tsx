import React, { useState } from "react";
import Button from "src/renderer/components/Button";
import RateLimiterTokens from "src/renderer/components/RateLimiterTokens";

import Items from "./components/Item/Items";
import LiveSearchesList from "./components/LiveSearchesList";

import AutoTeleportToggle from "./components/AutoTeleportToggle";
import Logs from "./components/Logs";
import { usePoeSessionId, useResults } from "src/shared/store/hooks";
import { useLiveSearchContext } from "./components/context/hooks/useLiveSearchContext";
import { isWsStateAnyOf } from "src/renderer/helpers/isWsStateAnyOf";
import { WebSocketState } from "src/shared/types";
import LastTeleportedItemModal from "./components/modals/LastTeleportedItemModal";

const PoELiveSearch = () => {
  const { clearResults } = useResults();

  const { liveSearches, ws } = useLiveSearchContext();
  const [sessionId] = usePoeSessionId();

  const [isConnectingAll, setIsConnectingAll] = useState(false);
  const [isDisconnectingAll, setIsDisconnectingAll] = useState(false);

  const handleConnectAll = async () => {
    setIsConnectingAll(true);
    await ws.connectAll();
    setIsConnectingAll(false);
  };
  const handleConnectAllAndDisconnect = async () => {
    setIsDisconnectingAll(true);
    await ws.cancelAllAndDisconnect();
    setIsDisconnectingAll(false);
  };
  const handleDisconnectAll = async () => {
    setIsDisconnectingAll(true);
    await ws.disconnectAll();
    setIsDisconnectingAll(false);
  };

  const handleClearListings = () => {
    clearResults();
  };

  const hasActiveConnections = liveSearches.some(
    (search) => !isWsStateAnyOf(search.ws?.readyState, WebSocketState.CLOSED)
  );

  return (
    <div className="w-full overflow-hidden flex flex-col gap-5 card max-w-[1000px] mx-auto">
      <div className="flex gap-2 items-end justify-between">
        <h1 className="text-2xl text-gray-200 font-bold">Live Search</h1>
        <RateLimiterTokens />
      </div>

      <div className="flex gap-2 items-end justify-between">
        <LiveSearchesList connectDisabled={isConnectingAll} />

        <div className="flex flex-col gap-1">
          <AutoTeleportToggle />

          <Button
            variant="danger"
            className="w-full !p-0"
            onClick={handleConnectAllAndDisconnect}
          >
            Force Stop All
          </Button>

          {!hasActiveConnections || isConnectingAll ? (
            <div className="flex gap-2 flex-col">
              <Button
                variant="success"
                onClick={handleConnectAll}
                disabled={
                  hasActiveConnections ||
                  liveSearches.length === 0 ||
                  !sessionId ||
                  isConnectingAll
                }
              >
                Start Sniping
              </Button>
            </div>
          ) : (
            <Button
              variant="danger"
              disabled={isDisconnectingAll}
              onClick={handleDisconnectAll}
            >
              Stop Sniping
            </Button>
          )}
        </div>
      </div>

      <Logs />

      <div>
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold mb-2">Listings:</h3>
          <button
            className="hover:text-gray-400 rounded-md w-fit px-2 py-1 ml-auto text-gray-600"
            onClick={handleClearListings}
          >
            Clear Listings
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Items />
      </div>

      <LastTeleportedItemModal />
    </div>
  );
};

export default PoELiveSearch;
