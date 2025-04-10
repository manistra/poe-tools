import React, { useEffect, useState } from "react";
import Button from "src/components/Button";
import CollapsibleItem from "src/components/CollapsibleItem";
import Input from "src/components/Input";

import Items from "src/poe-tools/components/Items";

import clsx from "clsx";
import { usePoeLiveSearch } from "./usePoeLiveSearch";
import {
  TransformedItemData,
  transformItemData,
} from "src/poe-tools/utils/transformItemData";
import { sendNotification } from "src/poe-tools/utils/useNotification";
import { getPoeSessionId } from "src/poe-tools/utils/getPoeSessionId";

const PoELiveSearch = () => {
  const [calculateForAmazonAscendancy, setCalculateForAmazonAscendancy] =
    useState(
      window.localStorage.getItem("live-calculateForAmazonAscendancy") ===
        "true"
    );
  const [minDps, setMinDps] = useState(
    Number(window.localStorage.getItem("live-minDps")) || 400
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
      const transformedDetails = itemDetails.map((itemData) =>
        transformItemData(itemData, calculateForAmazonAscendancy)
      );

      const filteredDetails = transformedDetails.filter((transformedItem) => {
        const exceedsDamage =
          transformedItem.calculatedDamage.highestPotentialDpsValue?.value >=
          Number(minDps);

        if (exceedsDamage) {
          sendNotification(
            `${transformedItem.calculatedDamage.highestPotentialDpsValue?.value} DPS (crit: ${transformedItem.criticalChance}) for ${transformedItem.price?.amount} ${transformedItem.price?.currency}`,
            `${transformedItem.name} exceeds ${minDps} DPS with Accuracy`
          );
        }

        return exceedsDamage;
      });

      setItemsToShow(filteredDetails);
    }
  }, [itemDetails]);

  useEffect(() => {
    if (itemDetails.length > 0) {
      const transformedDetails = itemDetails.map((itemData) =>
        transformItemData(itemData, calculateForAmazonAscendancy)
      );

      const filteredDetails = transformedDetails.filter((transformedItem) => {
        const exceedsDamage =
          transformedItem.calculatedDamage.highestPotentialDpsValue?.value >=
          Number(minDps);

        return exceedsDamage;
      });

      setItemsToShow(filteredDetails);
    }
  }, [minDps, calculateForAmazonAscendancy]);

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

      <CollapsibleItem
        title="Search Settings"
        className="flex-row justify-between flex gap-2"
      >
        <div className="flex flex-col gap-2">
          <Input
            type="number"
            label="Minimum Dps (Always takes the Calculated higest overall highest DPS for comparison):"
            value={minDps}
            onChange={(value) => {
              setMinDps(Number(value));
              window.localStorage.setItem("live-minDps", String(value));
            }}
            placeholder="400"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="mb-1 text-[12px] font-medium text-gray-500">
            Calculate for Amazon Ascendancy:
          </label>
          <input
            type="checkbox"
            className="w-6 h-6"
            checked={calculateForAmazonAscendancy}
            onChange={(e) => {
              setCalculateForAmazonAscendancy(e.target.checked);
              window.localStorage.setItem(
                "live-calculateForAmazonAscendancy",
                String(e.target.checked)
              );
            }}
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
        <Items
          items={itemsToShow}
          calculateForAmazonAscendancy={calculateForAmazonAscendancy}
        />
      </div>
    </div>
  );
};

export default PoELiveSearch;
