import React from "react";
import Button from "src/renderer/components/Button";
import RateLimiterTokens from "src/renderer/components/RateLimiterTokens";

import Items from "./components/Item/Items";
import LiveSearchesList from "./components/LiveSearchesList";

import { transformItemData } from "../helpers/transformItemData";
import AutoTeleportToggle from "./components/AutoTeleportToggle";
import Logs from "./components/Logs";
import { mockData } from "../mocks/mockData";

const PoELiveSearch = () => {
  const handleClearListings = () => {
    alert("Clear Listings");
  };

  return (
    <div className="w-full overflow-hidden flex flex-col gap-5 card max-w-[1000px] mx-auto">
      <div className="flex gap-2 items-end justify-between">
        <h1 className="text-2xl text-gray-200 font-bold">Live Search</h1>
        <RateLimiterTokens />
      </div>

      <div className="flex gap-2 items-end justify-between">
        <LiveSearchesList />

        <div className="flex flex-col gap-1">
          <div className="flex flex-col">
            {/* Error */}
            {/* Debug information */}
          </div>

          {/* Auto-whisper controls */}
          <AutoTeleportToggle />

          {/* {!hasActiveConnections && !hasConnectingSearches ? ( */}
          <Button
            variant="success"
            // onClick={connect}
            // disabled={!sessionId || allLiveSearches.length === 0}
          >
            Start Sniping
          </Button>
          {/* ) : ( */}
          <Button
            variant="danger"
            // onClick={disconnect}
          >
            Stop Sniping
          </Button>
          {/* )} */}
        </div>
      </div>

      <Logs logs={[]} />

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
        <Items items={mockData.map(transformItemData)} />
      </div>

      {/* <CooldownModal
        isOpen={isCooldownModalOpen}
        setIsCooldownOpen={setIsCooldownModalOpen}
        lastWhisperItem={lastWhisperItem}
        onClearCooldown={clearWhisperBlock}
      /> */}
    </div>
  );
};

export default PoELiveSearch;
