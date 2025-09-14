import React, { useState } from "react";

import { isWsStateAnyOf } from "src/renderer/helpers/isWsStateAnyOf";
import { WebSocketState } from "src/shared/types";
import { useLiveSearchContext } from "../../../context/hooks/useLiveSearchContext";
import { usePoeSessionId } from "src/shared/store/hooks";
import AutoBuyToggles from "./AutoBuyToggles";
import { Cog6ToothIcon, PlayIcon, StopIcon } from "@heroicons/react/24/solid";
import SettingsModal from "../../modals/SettingsModal";
import clsx from "clsx";

interface ControlsProps {
  isConnectingAll: boolean;
  setIsConnectingAll: (value: boolean) => void;
}

const Controls: React.FC<ControlsProps> = ({
  isConnectingAll,
  setIsConnectingAll,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [, setIsDisconnectingAll] = useState(false);

  const [sessionId] = usePoeSessionId();
  const { liveSearches, ws } = useLiveSearchContext();

  const handleConnectAll = async () => {
    setIsConnectingAll(true);
    await ws.connectAll();
    setIsConnectingAll(false);
  };

  const handleCancelAllAndDisconnect = async () => {
    setIsDisconnectingAll(true);
    await ws.cancelAllAndDisconnect();
    setIsDisconnectingAll(false);
  };

  const hasActiveConnections = liveSearches.some(
    (search) => !isWsStateAnyOf(search.ws?.readyState, WebSocketState.CLOSED)
  );
  return (
    <div className="flex flex-row h-[50px] justify-between w-full items-center">
      <div className="flex flex-row gap-2">
        {hasActiveConnections ? (
          <div className="relative flex items-center justify-center size-14">
            {/* Main pulse container */}
            <div className="absolute w-10 h-10 rounded-full bg-gradient-to-br from-[#0d4f0d] via-[#1a5f1a] to-[#0a3a0a] shadow-[6px_6px_12px_rgba(0,0,0,0.8),2px_2px_4px_rgba(0,0,0,0.4)]">
              {/* Base layer with shadow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#2d7a2d] via-[#1e5f1e] to-[#0f3f0f] opacity-80 shadow-inner"></div>
              {/* Primary pulse with glow shadow */}
              <div className="animate-ping absolute inset-1 rounded-full bg-gradient-to-br from-[#3d8a3d] via-[#2d6a2d] to-[#1d4a1d] shadow-[0_0_8px_rgba(61,138,61,0.4)]"></div>
              {/* Outer ring pulse with shadow */}
              <div
                className="absolute -inset-1 rounded-full border border-[#3d8a3d] opacity-40 animate-ping shadow-[0_0_12px_rgba(61,138,61,0.3)]"
                style={{ animationDelay: "0.5s", animationDuration: "2s" }}
              ></div>
            </div>
          </div>
        ) : (
          <button
            className="text-xs transition duration-200 opacity-60 hover:opacity-100 hover:scale-[104%] disabled:opacity-20 disabled:cursor-not-allowed"
            onClick={handleConnectAll}
            disabled={
              hasActiveConnections ||
              liveSearches.length === 0 ||
              !sessionId ||
              isConnectingAll
            }
          >
            <PlayIcon className="size-14" />
          </button>
        )}

        <button
          title="Stop All Live Searches"
          className="text-xs transition duration-200 opacity-60 hover:opacity-100 hover:scale-[104%] hover:text-red-800 disabled:opacity-20 disabled:cursor-not-allowed"
          onClick={handleCancelAllAndDisconnect}
        >
          <StopIcon className="size-14" />
        </button>

        <button
          className={clsx(
            "text-xs transition opacity-60 hover:opacity-100 hover:scale-[104%] hover:rotate-90 duration-400",
            !sessionId && "animate-bounce hover:animate-none"
          )}
          onClick={() => setIsSettingsOpen(true)}
        >
          <Cog6ToothIcon className="size-11" />
        </button>
      </div>

      <AutoBuyToggles />

      <SettingsModal
        isOpen={isSettingsOpen}
        setIsSettingsOpen={setIsSettingsOpen}
      />
    </div>
  );
};

export default Controls;
