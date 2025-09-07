import React, { useState, useEffect } from "react";
import Button from "src/components/Button";
import CollapsibleItem from "src/components/CollapsibleItem";
import Input from "src/components/Input";

import Items from "src/poe-tools/components/Items";

import clsx from "clsx";

import { getPoeSessionId } from "src/poe-tools/utils/getPoeSessionId";
import { transformItemData } from "./utils/transformItemData";
import { usePoeLiveSearch } from "./utils/usePoeLiveSearch";
import SearchConfigManager from "./components/SearchConfigManager";
import { getActiveSearchConfigs } from "./utils/searchConfigManager";

const PoELiveSearch = () => {
  const {
    searchUrls,
    setSearchUrls,
    isConnected,
    connect,
    disconnect,
    error,
    logs,
    itemDetails,
    isLoading,
    clearListings,
    activeSearchConfigs,
    updateCurrentSearchUrl,
    connectionStatuses,
    hasActiveConnections,
    totalConnections,
    autoWhisper,
    toggleAutoWhisper,
    whisperCooldown,
    clearWhisperCooldown,
  } = usePoeLiveSearch();

  const [showConfigManager, setShowConfigManager] = useState(false);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);

  const handleClearListings = () => {
    clearListings();
  };

  const handleConfigsChange = () => {
    // This will trigger a re-render of the hook
    window.location.reload(); // Simple way to refresh the hook state
  };

  const currentSearchUrl = activeSearchConfigs[currentSearchIndex]?.url || "";
  const currentSearchLabel =
    activeSearchConfigs[currentSearchIndex]?.label || "No Search Selected";

  return (
    <div className="w-full overflow-hidden flex flex-col gap-5 card max-w-[1000px] mx-auto">
      <div className="flex gap-2 items-end justify-between">
        <div>
          <h1 className="text-2xl text-gray-200 font-bold">Live Search</h1>
        </div>

        <div className="flex gap-2">
          <Button
            size="small"
            variant="outline"
            onClick={() => setShowConfigManager(!showConfigManager)}
          >
            {showConfigManager ? "Hide Config" : "Manage Searches"}
          </Button>
        </div>
      </div>

      {showConfigManager && (
        <div className="border border-gray-700 rounded-md p-4 bg-gray-900">
          <SearchConfigManager onConfigsChange={handleConfigsChange} />
        </div>
      )}

      <div className="flex gap-2 items-end justify-between">
        <div className="flex-1">
          {activeSearchConfigs.length > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-400">
                  Active Searches ({totalConnections}):
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

              <div className="space-y-1">
                {activeSearchConfigs.map((config) => {
                  const status = connectionStatuses.get(config.id);
                  const isConnected = status?.isConnected || false;
                  const hasError = status?.error;

                  return (
                    <div
                      key={config.id}
                      className={clsx(
                        "flex items-center justify-between p-2 rounded border",
                        isConnected
                          ? "border-green-600 bg-green-900/20"
                          : "border-gray-700 bg-gray-900"
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-200 truncate">
                          {config.label}
                        </div>
                        <div className="text-xs text-gray-400 truncate">
                          {config.url}
                        </div>
                        {hasError && (
                          <div className="text-xs text-red-400 mt-1">
                            Error: {hasError}
                          </div>
                        )}
                      </div>
                      <div className="ml-2 flex items-center gap-2">
                        <div
                          className={clsx(
                            "w-2 h-2 rounded-full",
                            isConnected ? "bg-green-400" : "bg-red-400"
                          )}
                        />
                        <span className="text-xs text-gray-400">
                          {isConnected ? "Live" : "Offline"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-gray-400 text-sm">
              No active searches. Add one in the configuration manager above.
            </div>
          )}
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
                : "Ready to start monitoring"}
            </span>
            {error && <p style={{ color: "red" }}>Error: {error}</p>}

            {/* Debug information */}
            <div className="text-xs text-gray-400 mt-1">
              <div>
                POE Session ID: {getPoeSessionId() ? "✓ Set" : "✗ Missing"}
              </div>
              <div>Active Searches: {activeSearchConfigs.length}</div>
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

            {/* Quick add search button */}
            {activeSearchConfigs.length === 0 && getPoeSessionId() && (
              <div className="mt-2">
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => setShowConfigManager(true)}
                  className="text-xs"
                >
                  + Add Search Configuration
                </Button>
              </div>
            )}
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
              <span>Auto-whisper</span>
            </label>

            {whisperCooldown > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-yellow-400">
                  Cooldown: {Math.ceil(whisperCooldown / 1000)}s
                </span>
                <Button
                  size="small"
                  variant="outline"
                  onClick={clearWhisperCooldown}
                  className="text-xs px-2 py-1"
                >
                  Clear
                </Button>
              </div>
            )}
          </div>
          {!hasActiveConnections ? (
            <Button
              variant="success"
              onClick={connect}
              disabled={!getPoeSessionId() || activeSearchConfigs.length === 0}
            >
              {!getPoeSessionId()
                ? "Set POE Session ID First"
                : activeSearchConfigs.length === 0
                ? "Add Searches First"
                : "Start Monitoring"}
            </Button>
          ) : (
            <Button variant="danger" onClick={disconnect}>
              Stop Monitoring
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
        <Items
          items={itemDetails.map(transformItemData)}
          showSaveButton={true}
        />
      </div>
    </div>
  );
};

export default PoELiveSearch;
