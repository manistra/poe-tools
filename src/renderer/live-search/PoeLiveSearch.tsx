import React, { useState } from "react";

import Navbar from "./components/Navbar/Navbar";
import LiveSearchesList from "./components/LiveSearches/LiveSearchesList";
import Items from "./components/Listings/Items";
import { usePoeSessionId } from "src/shared/store/hooks";

const PoELiveSearch = () => {
  const [isConnectingAll, setIsConnectingAll] = useState(false);
  const [poeSessionId] = usePoeSessionId();

  return (
    <div className="w-full flex flex-col gap-5 p-5 max-w-[1250px] mx-auto">
      {!poeSessionId && (
        <div className="absolute top-0 left-0 w-full text-center text-red-500 text-sm py-3 bg-red-900 bg-opacity-25 z-50">
          ⚠️ POESESSIONID is not set. Please set the POESESSIONID in the
          settings. ⚠️
        </div>
      )}

      <Navbar
        isConnectingAll={isConnectingAll}
        setIsConnectingAll={setIsConnectingAll}
      />

      <div className="w-full flex flex-row gap-5 mx-auto h-[calc(100vh-200px)]">
        <LiveSearchesList connectDisabled={isConnectingAll} />

        <Items />
      </div>
    </div>
  );
};

export default PoELiveSearch;
