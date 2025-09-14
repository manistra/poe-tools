import React, { useState } from "react";
import clsx from "clsx";
import Button from "src/renderer/components/Button";
import Input from "src/renderer/components/Input";
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

interface LiveSearchItemProps {
  liveSearch: LiveSearch;
  isConnectingAll: boolean;
}

const LiveSearchItem: React.FC<LiveSearchItemProps> = ({
  liveSearch,
  isConnectingAll,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editLabel, setEditLabel] = useState(liveSearch.label);
  const [editUrl, setEditUrl] = useState(liveSearch.url);
  const { updateLiveSearch, deleteLiveSearch, ws } = useLiveSearchContext();
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

  const handleSave = () => {
    if (!editLabel.trim() || !editUrl.trim()) {
      toast.error("Please provide both label and URL");
      return;
    }

    try {
      updateLiveSearch(liveSearch.id, {
        label: editLabel.trim(),
        url: editUrl.trim(),
      });

      setIsOpen(false);
      toast.success("Search configuration updated");
    } catch (error) {
      toast.error("Failed to update search configuration");
    }
  };

  const handleCancel = () => {
    setEditLabel(liveSearch.label);
    setEditUrl(liveSearch.url);
    setIsOpen(false);
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
                onClick={() => setIsOpen(!isOpen)}
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
                isOpen ||
                isConnecting ||
                isConnectingAll ||
                isWsStateAnyOf(
                  liveSearch?.ws?.readyState,
                  WebSocketState.OPEN,
                  WebSocketState.CONNECTING
                )
              }
              className={clsx(
                isOpen ||
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

      {isOpen && (
        <div className="flex items-center gap-2 w-full p-5">
          <div className="flex-1 flex flex-row items-end gap-3 min-w-0 ">
            <div className="flex flex-col gap-2 w-full">
              <Input
                label="Live Search Label:"
                className="text-xs"
                value={editLabel}
                onChange={(value) => setEditLabel(String(value))}
              />
              <Input
                label="URL:"
                className="text-xs"
                value={editUrl}
                onChange={(value) => setEditUrl(String(value))}
              />
            </div>

            <div className="flex flex-col justify-between gap-2">
              <Button
                size="small"
                variant="outline"
                onClick={handleCancel}
                className="text-xs px-2 py-1"
              >
                Cancel
              </Button>
              <Button
                size="small"
                variant="success"
                onClick={handleSave}
                className="text-xs px-2 py-1"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveSearchItem;
