import React, { useState } from "react";
import clsx from "clsx";
import { electronAPI } from "src/renderer/api/electronAPI";

import { toast } from "react-hot-toast";
import { LiveSearch, WebSocketState } from "src/shared/types";
import { useLiveSearchContext } from "../../../context/hooks/useLiveSearchContext";
import { isWsStateAnyOf } from "src/renderer/helpers/isWsStateAnyOf";
import {
  PencilIcon,
  SignalIcon,
  SignalSlashIcon,
} from "@heroicons/react/24/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
import EditLiveSearchModal from "../../modals/EditLiveSearchModal";
import CurrencyConditionView from "./CurrencyConditionView";

interface LiveSearchItemProps {
  liveSearch: LiveSearch;
  isConnectingAll: boolean;
  resultsCount: number;
}

const LiveSearchItem: React.FC<LiveSearchItemProps> = ({
  liveSearch,
  isConnectingAll,
  resultsCount,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { deleteLiveSearch, ws } = useLiveSearchContext();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    await ws.connectIndividual(liveSearch.id);
    setIsConnecting(false);
  };

  const handleUrlClick = async (url: string) => {
    try {
      // Remove "/live" suffix if it exists
      const cleanUrl = url.endsWith("/live") ? url.slice(0, -5) : url;
      await electronAPI.shell.openExternal(cleanUrl);
    } catch (error) {
      console.error("Failed to open external URL:", error);
    }
  };

  const handleDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this search configuration?"
      )
    ) {
      try {
        deleteLiveSearch(liveSearch);

        toast.success("Live Search deleted");
      } catch (error) {
        toast.error("Failed to delete search configuration");
      }
    }
  };

  return (
    <div
      className={clsx(
        "flex-col items-center justify-between rounded border bg-gradient-to-r from-[#000000] to-green-900/20 w-full",
        isWsStateAnyOf(liveSearch?.ws?.readyState, WebSocketState.OPEN)
          ? "border-[#0d311e]/70"
          : isWsStateAnyOf(
              liveSearch?.ws?.readyState,
              WebSocketState.CONNECTING
            ) || isConnecting
          ? "border-yellow-900/20 bg-yellow-900/20"
          : "border-gray-900 bg-gray-900"
      )}
    >
      <div className="flex items-center justify-between rounded py-2 w-full px-3">
        <div className="flex items-center flex-row gap-2">
          <div
            className={clsx("w-3 h-3 rounded-full relative shadow-sm", {
              "bg-gradient-to-br from-green-600 to-green-800 border border-green-700 shadow-green-500/30":
                isWsStateAnyOf(liveSearch?.ws?.readyState, WebSocketState.OPEN),
              "bg-gradient-to-br from-red-600 to-red-800 border border-red-700 shadow-red-500/30":
                isWsStateAnyOf(
                  liveSearch?.ws?.readyState,
                  WebSocketState.CLOSED
                ),
              "bg-gradient-to-br from-yellow-600 to-yellow-800 border border-yellow-700 shadow-yellow-500/30 animate-pulse":
                isWsStateAnyOf(
                  liveSearch?.ws?.readyState,
                  WebSocketState.CONNECTING
                ) || isConnectingAll,
              "bg-gradient-to-br from-red-300 to-red-500 border border-red-700 shadow-red-400/30 animate-pulse":
                isWsStateAnyOf(
                  liveSearch?.ws?.readyState,
                  WebSocketState.CLOSING
                ),
            })}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent to-white/20" />
          </div>

          <button
            title={liveSearch.label}
            onClick={() => handleUrlClick(liveSearch.url)}
            className="text-gray-300 hover:text-blue-900 hover:underline cursor-pointer text-left text-sm flex flex-row items-center gap-1 max-w-[270px]"
          >
            <span className="truncate">{liveSearch.label}</span>
          </button>
        </div>

        <div className="text-xs text-red-500">
          {liveSearch?.ws?.error?.code} {liveSearch?.ws?.error?.reason}
        </div>

        <div className="flex items-center gap-2">
          {!(
            isConnecting ||
            isConnectingAll ||
            isWsStateAnyOf(
              liveSearch?.ws?.readyState,
              WebSocketState.OPEN,
              WebSocketState.CLOSING,
              WebSocketState.CONNECTING
            )
          ) && (
            <>
              <button
                title="Delete"
                onClick={handleDelete}
                className="hover:opacity-80 hover:text-red-300 transition duration-200 cursor-pointer opacity-65"
              >
                <TrashIcon className="size-5" />
              </button>

              <button
                title="Edit"
                onClick={() => setIsEditModalOpen(true)}
                className="hover:scale-[104%] opacity-80 transition-transform duration-200 cursor-pointer hover:-rotate-12 hover:opacity-100"
              >
                <PencilIcon className="size-5" />
              </button>
            </>
          )}

          {isWsStateAnyOf(
            liveSearch?.ws?.readyState,
            WebSocketState.OPEN,
            WebSocketState.CONNECTING
          ) && (
            <button
              title="Disconnect"
              disabled={isWsStateAnyOf(
                liveSearch?.ws?.readyState,
                WebSocketState.CLOSED,
                WebSocketState.CLOSING
              )}
              onClick={() => ws.disconnectIndividual(liveSearch.id)}
              className={clsx(
                isWsStateAnyOf(
                  liveSearch?.ws?.readyState,
                  WebSocketState.CLOSED,
                  WebSocketState.CLOSING
                )
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:scale-[104%] transition-transform duration-200 cursor-pointer opacity-80 hover:opacity-100"
              )}
            >
              <SignalSlashIcon className="size-6 hover:scale-[104%] hover:text-red-500 transition-transform duration-200 cursor-pointer" />
            </button>
          )}
          {isWsStateAnyOf(
            liveSearch?.ws?.readyState,
            WebSocketState.CLOSED,
            WebSocketState.CLOSING
          ) && (
            <button
              title="Connect"
              onClick={() => handleConnect()}
              disabled={
                isConnecting ||
                isConnectingAll ||
                isWsStateAnyOf(
                  liveSearch?.ws?.readyState,
                  WebSocketState.OPEN,
                  WebSocketState.CONNECTING
                )
              }
              className={clsx(
                isConnecting ||
                  isConnectingAll ||
                  isWsStateAnyOf(
                    liveSearch?.ws?.readyState,
                    WebSocketState.OPEN,
                    WebSocketState.CONNECTING
                  )
                  ? "opacity-30 cursor-not-allowed"
                  : "transition-transform duration-200 cursor-pointer"
              )}
            >
              <SignalIcon className="opacity-80 hover:opacity-100 size-6 hover:scale-[104%] hover:text-green-200 transition-transform duration-200 cursor-pointer" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-row gap-2 justify-between px-3 pb-2 w-full border-t border-gray-700/20 border-dashed pt-2">
        <div>
          {liveSearch.currencyConditions &&
            liveSearch.currencyConditions.length > 0 && (
              <CurrencyConditionView
                currencyConditions={liveSearch.currencyConditions || []}
              />
            )}
        </div>
        {resultsCount > 0 && (
          <p className="self-end text-xs text-gray-500 text-nowrap">
            Results:{" "}
            <span
              className={clsx("text-gray-300", {
                "text-orange-100": resultsCount > 4,
                "text-orange-200": resultsCount > 8,
                "text-orange-300": resultsCount > 12,
                "text-orange-400": resultsCount > 16,
                "text-orange-500": resultsCount > 20,
                "text-orange-600": resultsCount > 24,
                "text-red-800": resultsCount > 28,
                "text-red-700": resultsCount > 28,
                "text-red-600": resultsCount > 32,
              })}
            >
              {resultsCount}
            </span>
          </p>
        )}
      </div>

      <EditLiveSearchModal
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        liveSearch={liveSearch}
      />
    </div>
  );
};

export default LiveSearchItem;
