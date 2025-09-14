import React from "react";

import PoeLiveSearch from "./live-search/PoeLiveSearch";
import ApiTester from "./components/ApiTester";
import GridOverlayManager from "./components/GridOverlayManager";

import { useIsTeleportingBlocked } from "src/shared/store/hooks";
import LastTeleportedItemModal from "./live-search/components/modals/LastTeleportedItemModal";

export default function App() {
  const [isTeleportingBlocked, setIsTeleportingBlocked] =
    useIsTeleportingBlocked();
  return (
    <div className="w-full">
      {isTeleportingBlocked && (
        <div className="flex-col flex gap-1 items-center justify-center border-b border-l top-0 right-0 absolute border-red-900 p-3 z-30 bg-red-950 text-red-200 bg-opacity-25">
          <span className="font-bold text-red-200 animate-pulse text-3xl">
            Auto Teleport Blocked
          </span>

          <span className="text-red-200 text-base">
            Press the button below to unblock.
          </span>
          <button
            className="text-red-200 text-base bg-green-900 border-green-700 border px-4  rounded-md"
            onClick={() => setIsTeleportingBlocked(false)}
          >
            Unblock
          </button>
        </div>
      )}

      {false && (
        <div className="w-full overflow-hidden flex flex-col gap-5 card max-w-[1000px] mx-auto">
          <ApiTester />
        </div>
      )}

      <PoeLiveSearch />

      <LastTeleportedItemModal />

      <GridOverlayManager />
    </div>
  );
}
