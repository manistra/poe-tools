import React, { useState } from "react";
import clsx from "clsx";
import Button from "src/renderer/components/Button";
import Input from "src/renderer/components/Input";
import { electronAPI } from "src/renderer/api/electronAPI";

import { toast } from "react-hot-toast";
import { LiveSearch, WebSocketState } from "src/shared/types";
import { useLiveSearchContext } from "./context/hooks/useLiveSearchContext";
import { isWsStateAnyOf } from "src/renderer/helpers/isWsStateAnyOf";

interface LiveSearchItemProps {
  liveSearch: LiveSearch;
}

const LiveSearchItem: React.FC<LiveSearchItemProps> = ({ liveSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editLabel, setEditLabel] = useState(liveSearch.label);
  const [editUrl, setEditUrl] = useState(liveSearch.url);
  const { updateLiveSearch, deleteLiveSearch, ws } = useLiveSearchContext();

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
        "flex-col items-center justify-between rounded border border-gray-900 bg-gray-900"
        // isConnected
        //   ? "border-[#0d311e]/20"
        //   : isLoading
        //   ? "border-yellow-900/20 bg-yellow-900/20"
        //   : "border-gray-900 bg-gray-900"
      )}
    >
      <div className="flex items-center justify-between rounded p-1 w-full bg-gradient-to-r from-[#000000] to-green-900/20">
        <button
          onClick={() => handleUrlClick(liveSearch.url)}
          className="text-gray-400 truncate hover:text-blue-900 hover:underline cursor-pointer text-left text-sm flex flex-row items-center gap-1"
        >
          {liveSearch.label}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
            />
          </svg>
        </button>

        <div className="ml-2 flex items-center gap-2">
          <div className="flex gap-2 mx-2">
            {isWsStateAnyOf(
              liveSearch?.ws?.readyState,
              WebSocketState.OPEN,
              WebSocketState.CONNECTING
            ) && (
              <Button
                size="small"
                variant="text"
                disabled={isWsStateAnyOf(
                  liveSearch?.ws?.readyState,
                  WebSocketState.CLOSED,
                  WebSocketState.CLOSING
                )}
                onClick={() => ws.disconnectIndividual(liveSearch.id)}
                className="text-xs text-red-900/20 border border-red-900/20 p-2 hover:text-red-500 hover:border-red-500"
              >
                Disconnect
              </Button>
            )}
            {isWsStateAnyOf(
              liveSearch?.ws?.readyState,
              WebSocketState.CLOSED,
              WebSocketState.CLOSING
            ) && (
              <Button
                size="small"
                variant="text"
                onClick={() => ws.connectIndividual(liveSearch.id)}
                disabled={
                  isOpen ||
                  isWsStateAnyOf(
                    liveSearch?.ws?.readyState,
                    WebSocketState.OPEN,
                    WebSocketState.CONNECTING
                  )
                }
                className="text-xs text-green-700 border border-green-700 p-2 hover:text-green-500 hover:border-green-500"
              >
                Connect
              </Button>
            )}

            <Button
              disabled={isWsStateAnyOf(
                liveSearch?.ws?.readyState,
                WebSocketState.OPEN,
                WebSocketState.CLOSING,
                WebSocketState.CONNECTING
              )}
              size="small"
              variant="outline"
              onClick={() => setIsOpen(!isOpen)}
              className="text-xs px-2 py-1 flex flex-row items-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4 hover:scale-110 transition-transform duration-200 cursor-pointer"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
              Edit
            </Button>
          </div>

          <div
            className={clsx("w-2 h-2 rounded-full", {
              "bg-green-400": isWsStateAnyOf(
                liveSearch?.ws?.readyState,
                WebSocketState.OPEN
              ),
              "bg-red-400": isWsStateAnyOf(
                liveSearch?.ws?.readyState,
                WebSocketState.CLOSED
              ),
              "bg-yellow-400 animate-pulse": isWsStateAnyOf(
                liveSearch?.ws?.readyState,
                WebSocketState.CONNECTING
              ),
              "bg-red-300 animate-pulse": isWsStateAnyOf(
                liveSearch?.ws?.readyState,
                WebSocketState.CLOSING
              ),
            })}
          />
          <span className="text-xs text-gray-400 mr-2">
            {isWsStateAnyOf(liveSearch?.ws?.readyState, WebSocketState.OPEN)
              ? "Live"
              : isWsStateAnyOf(
                  liveSearch?.ws?.readyState,
                  WebSocketState.CONNECTING
                )
              ? "Connecting..."
              : isWsStateAnyOf(
                  liveSearch?.ws?.readyState,
                  WebSocketState.CLOSING
                )
              ? "Closing..."
              : "Offline"}
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="flex border-t border-gray-700 mt-1 items-center gap-2 w-full p-5 bg-black">
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

            <div className="flex flex-row gap-2">
              <Button
                size="small"
                variant="danger"
                onClick={handleDelete}
                className="text-xs px-2 py-1"
              >
                Delete
              </Button>
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
