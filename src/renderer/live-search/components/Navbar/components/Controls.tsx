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

        <button
          className="text-xs transition duration-200 opacity-60 hover:opacity-100 hover:scale-[104%] disabled:opacity-20 disabled:cursor-not-allowed"
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
