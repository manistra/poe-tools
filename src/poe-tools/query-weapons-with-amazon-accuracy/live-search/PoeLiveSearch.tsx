import React, { useEffect, useState } from "react";
import Button from "src/components/Button";
import CollapsibleItem from "src/components/CollapsibleItem";
import Input from "src/components/Input";

import Items from "src/poe-tools/components/Items";

import clsx from "clsx";
import { usePoeLiveSearch } from "./usePoeLiveSearch";
import { TransformedItemData } from "src/poe-tools/utils/transformItemData";
import { sendNotification } from "src/poe-tools/utils/useNotification";
import { getPoeSessionId } from "src/poe-tools/utils/getPoeSessionId";

const PoELiveSearch = () => {
  const [minimumTotalDpsWithAccuracy, setMinimumTotalDpsWithAccuracy] =
    useState(
      Number(window.localStorage.getItem("live-minimumTotalDpsWithAccuracy")) ||
        400
    );

  const [itemsToShow, setItemsToShow] = useState<TransformedItemData[]>([]);

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

  useEffect(() => {
    if (itemDetails.length > 0) {
      const filteredDetails = itemDetails.filter((transformedItem) => {
        const exceedsDamage =
          transformedItem.dpsWithAccuracy >=
          Number(minimumTotalDpsWithAccuracy);

        if (exceedsDamage) {
          sendNotification(
            `${transformedItem.dpsWithAccuracy} DPS (crit: ${transformedItem.criticalChance}) for ${transformedItem.price?.amount} ${transformedItem.price?.currency}`,
            `${transformedItem.name} exceeds ${minimumTotalDpsWithAccuracy} DPS with Accuracy`
          );
        }

        return exceedsDamage;
      });

      setItemsToShow(filteredDetails);
    }
  }, [itemDetails]);

  useEffect(() => {
    if (itemDetails.length > 0) {
      const filteredDetails = itemDetails.filter((transformedItem) => {
        const exceedsDamage =
          transformedItem.dpsWithAccuracy >=
          Number(minimumTotalDpsWithAccuracy);

        return exceedsDamage;
      });

      setItemsToShow(filteredDetails);
    }
  }, [minimumTotalDpsWithAccuracy]);

  return (
    <div className="w-full overflow-hidden flex flex-col gap-5 card max-w-[1000px] mx-auto">
      <div className="flex gap-2 items-end justify-between">
        <div>
          <h1 className="text-2xl text-gray-200 font-bold">Live Search</h1>

          <h2 className="text-gray-300">Weapon with Accuracy</h2>
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

      <CollapsibleItem title="Logs:">
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

      <CollapsibleItem title="Search Settings" className="flex-wrap flex gap-2">
        <div className="flex flex-col gap-2">
          <Input
            type="number"
            label="Minimum Total DPS with Accuracy:"
            value={minimumTotalDpsWithAccuracy}
            onChange={(value) => {
              setMinimumTotalDpsWithAccuracy(Number(value));
              window.localStorage.setItem(
                "live-minimumTotalDpsWithAccuracy",
                String(value)
              );
            }}
            placeholder="400"
          />
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
            onClick={clearListings}
          >
            Clear Listings
          </button>
        </div>
        <Items items={itemsToShow} />
      </div>
    </div>
  );
};

export default PoELiveSearch;
