import React from "react";
import Controls from "./components/Controls";
import Logs from "./components/Logs";
import RateLimiterTokens from "./components/RateLimiterTokens";

const Navbar: React.FC<{
  isConnectingAll: boolean;
  setIsConnectingAll: (value: boolean) => void;
}> = ({ isConnectingAll, setIsConnectingAll }) => {
  return (
    <nav className="w-full flex flex-row gap-5">
      <div className="w-[500px] max-w-[500px] min-w-[500px] flex flex-row gap-5 card p-8 justify-between items-center">
        <Controls
          isConnectingAll={isConnectingAll}
          setIsConnectingAll={setIsConnectingAll}
        />
      </div>

      <div className="w-full flex flex-row gap-5 card p-8 justify-between items-center flex-1">
        <Logs />

        <RateLimiterTokens />
      </div>
    </nav>
  );
};

export default Navbar;
