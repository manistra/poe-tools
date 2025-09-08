import React, { useState, useEffect } from "react";
import Button from "src/components/Button";
import CollapsibleItem from "src/components/CollapsibleItem";
import CooldownModal from "../components/CooldownModal";

import clsx from "clsx";

import { getPoeSessionId } from "src/poe-tools/utils/getPoeSessionId";
import { transformItemData } from "./utils/transformItemData";
import { usePoeLiveSearch } from "./utils/usePoeLiveSearch";
import Items from "../components/Item/Items";
import LiveSearchesList from "./components/LiveSearchesList";
import { useWebSocketConnection } from "./ConnectionContext/WebSocketConnectionProvider";

const PoELiveSearch = () => {
  const [isCooldownModalOpen, setIsCooldownModalOpen] = useState(false);

  const {
    connect,
    disconnect,
    error,
    logs,
    itemDetails,
    isLoading,
    clearListings,
    allSearchConfigs,
    autoWhisper,
    toggleAutoWhisper,
    lastWhisperItem,
    shouldShowCooldownModal,
    clearWhisperBlock,
  } = usePoeLiveSearch();

  const { hasActiveConnections, totalConnections, connectionStatuses } =
    useWebSocketConnection();

  // Show cooldown modal when whisper is sent
  useEffect(() => {
    if (shouldShowCooldownModal && lastWhisperItem) {
      setIsCooldownModalOpen(true);
    }
  }, [shouldShowCooldownModal, lastWhisperItem]);

  // Check if any search is currently connecting
  const hasConnectingSearches = Array.from(connectionStatuses.values()).some(
    (status) => status.isLoading
  );

  const handleClearListings = () => {
    clearListings();
  };

  return (
    <div className="w-full overflow-hidden flex flex-col gap-5 card max-w-[1000px] mx-auto">
      <div className="flex gap-2 items-end justify-between">
        <div>
          <h1 className="text-2xl text-gray-200 font-bold">Live Search</h1>
        </div>

        <div className="flex gap-2">
          {/* Config management is now integrated into LiveSearchesList */}
        </div>
      </div>

      <div className="flex gap-2 items-end justify-between">
        <div className="flex-1">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-400">
                Search Configurations ({allSearchConfigs.length} total,{" "}
                {totalConnections} active):
              </label>
              <div className="flex items-center gap-2 text-xs">
                <span
                  className={clsx(
                    "px-2 py-1 rounded",
                    hasActiveConnections
                      ? "bg-green-900/30 text-green-400"
                      : "bg-red-900/30 text-red-400"
                  )}
                >
                  {hasActiveConnections ? "Connected" : "Disconnected"}
                </span>
              </div>
            </div>

            <LiveSearchesList />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex flex-col">
            <span
              className={clsx(
                "text-green-500 text-[10px]",
                hasActiveConnections
                  ? "text-green-900 animate-pulse"
                  : "text-gray-500"
              )}
            >
              {hasActiveConnections
                ? `Monitoring ${totalConnections} searches...`
                : "Ready to start sniping"}
            </span>
            {error && <p style={{ color: "red" }}>Error: {error}</p>}

            {/* Debug information */}
            <div className="text-xs text-gray-400 mt-1">
              <div>
                POE Session ID: {getPoeSessionId() ? "✓ Set" : "✗ Missing"}
              </div>
              <div>Total Configurations: {allSearchConfigs.length}</div>
            </div>

            {/* POE Session ID input */}
            {!getPoeSessionId() && (
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Enter POE Session ID"
                  className="w-full px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      const value = (e.target as HTMLInputElement).value;
                      if (value) {
                        localStorage.setItem("poeSessionId", value);
                        window.location.reload();
                      }
                    }
                  }}
                />
                <div className="text-xs text-gray-500 mt-1">
                  Press Enter to save. Get this from your browser's developer
                  tools → Application → Local Storage → pathofexile.com
                </div>
              </div>
            )}

            {/* Quick add search button - now handled in LiveSearchesList */}
          </div>

          {/* Auto-whisper controls */}
          <div className="flex items-center gap-2 mt-2">
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={autoWhisper}
                onChange={toggleAutoWhisper}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span>Auto-Teleport ⚡</span>
            </label>
          </div>
          {!hasActiveConnections && !hasConnectingSearches ? (
            <Button
              variant="success"
              onClick={connect}
              disabled={!getPoeSessionId() || allSearchConfigs.length === 0}
            >
              {!getPoeSessionId()
                ? "Set POE Session ID First"
                : allSearchConfigs.length === 0
                ? "Add Searches First"
                : "Start Sniping"}
            </Button>
          ) : (
            <Button variant="danger" onClick={disconnect}>
              Stop Sniping
            </Button>
          )}
        </div>
      </div>
      {/* <div className="w-full">{JSON.stringify(itemDetails)}</div> */}
      <CollapsibleItem
        title="Logs:"
        specialTitle={
          logs[logs.length - 1]
            ? `Last log - ${logs[logs.length - 1]}`
            : undefined
        }
      >
        <div className="max-h-[300px] overflow-y-auto">
          {logs.length === 0 ? (
            <p>No messages received yet</p>
          ) : (
            <ul className="flex flex-col-reverse gap-2">
              {logs.map((log, index) => (
                <li key={index}>{log}</li>
              ))}
            </ul>
          )}
        </div>
      </CollapsibleItem>

      <div>
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold mb-2">
            Listings:
            {isLoading && (
              <span className="text-gray-400 text-xs px-4 animate-pulse">
                Loading items...
              </span>
            )}
          </h3>
          <button
            className="hover:text-gray-400 rounded-md w-fit px-2 py-1 ml-auto text-gray-600"
            onClick={handleClearListings}
          >
            Clear Listings
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Items items={itemDetails.map(transformItemData)} />
      </div>

      <CooldownModal
        isOpen={isCooldownModalOpen}
        setIsCooldownOpen={setIsCooldownModalOpen}
        lastWhisperItem={lastWhisperItem}
        onClearCooldown={clearWhisperBlock}
      />
    </div>
  );
};

export default PoELiveSearch;
