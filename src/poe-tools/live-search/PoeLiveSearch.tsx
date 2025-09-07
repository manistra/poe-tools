import React from "react";
import Button from "src/components/Button";
import CollapsibleItem from "src/components/CollapsibleItem";
import Input from "src/components/Input";

import Items from "src/poe-tools/components/Items";

import clsx from "clsx";

import { getPoeSessionId } from "src/poe-tools/utils/getPoeSessionId";
import { transformItemData } from "./utils/transformItemData";
import { usePoeLiveSearch } from "./utils/usePoeLiveSearch";

const PoELiveSearch = () => {
  const {
    searchUrl,
    setSearchUrl,
    isConnected,
    connect,
    disconnect,
    error,
    logs,
    itemDetails,
    isLoading,
    clearListings,
  } = usePoeLiveSearch();

  const handleClearListings = () => {
    clearListings();
  };

  return (
    <div className="w-full overflow-hidden flex flex-col gap-5 card max-w-[1000px] mx-auto">
      <div className="flex gap-2 items-end justify-between">
        <div>
          <h1 className="text-2xl text-gray-200 font-bold">Live Search</h1>
        </div>
        <div className="w-1/2 ml-auto">
          <Input
            className=""
            type="text"
            label="Search URL:"
            value={searchUrl}
            onChange={setSearchUrl}
            placeholder="https://www.pathofexile.com/trade/search/League/SearchID"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex flex-col">
            <span
              className={clsx(
                "text-green-500 text-[10px]",
                isConnected ? "text-green-900 animate-pulse" : "text-red-900"
              )}
            >
              {isConnected ? "Searching for items..." : "Disconnected"}
            </span>
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
          </div>
          {!isConnected ? (
            <Button
              variant="success"
              onClick={connect}
              disabled={isConnected || !searchUrl || !getPoeSessionId()}
            >
              Start Live Search
            </Button>
          ) : (
            <Button
              variant="danger"
              onClick={disconnect}
              disabled={!isConnected}
            >
              Stop Live Search
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
