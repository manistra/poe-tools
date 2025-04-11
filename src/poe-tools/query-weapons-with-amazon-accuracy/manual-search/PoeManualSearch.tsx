import React, { useEffect, useState } from "react";
import Button from "src/components/Button";

import CollapsibleItem from "src/components/CollapsibleItem";
import Input from "src/components/Input";
import TextArea from "src/components/TextArea";
import { useManualSearch } from "./useManualSearch";
import { transformItemData } from "src/poe-tools/query-weapons-with-amazon-accuracy/utils/calcs/transformItemData";
import { defaultBodyData } from "./defaultBodyData";
import Items from "src/poe-tools/components/Items";
import { ItemData, TransformedItemData } from "../utils/calcs/types";
import Checkbox from "src/components/Checkbox";

const searchUrl =
  "https://www.pathofexile.com/api/trade2/search/poe2/Dawn%20of%20the%20Hunt";

const PoEManualSearch = () => {
  const [itemDetails, setItemDetails] = useState<ItemData[]>([]);
  const [itemsToShow, setItemsToShow] = useState<TransformedItemData[]>([]);
  const [delay, setDelay] = useState<number>(
    Number(window.localStorage.getItem("manual-delay")) || 400
  );
  const [minDps, setMinDps] = useState(
    window.localStorage.getItem("manual-minDps") || 400
  );
  const [body, setBody] = useState(
    window.localStorage.getItem("manual-body") ||
      JSON.stringify(defaultBodyData)
  );
  const [calculateForAmazonAscendancy, setCalculateForAmazonAscendancy] =
    useState(
      window.localStorage.getItem("manual-calculateForAmazonAscendancy") ===
        "true"
    );

  const { performSearch, isLoading, logs, clearListings, cancelSearch } =
    useManualSearch({
      setItemDetails,
      delay,
    });

  const handleClearListings = () => {
    clearListings();
    setItemsToShow([]);
  };

  const handleReset = () => {
    cancelSearch();
  };

  useEffect(() => {
    const transformedItems = itemDetails.map((item) =>
      transformItemData(item, calculateForAmazonAscendancy)
    );

    const filteredDetails = transformedItems.filter((transformedItem) => {
      const damageToCompare = calculateForAmazonAscendancy
        ? transformedItem.calculatedDamageAmazonScaling.highestPotentialDpsValue
            ?.value
        : transformedItem.calculatedDamage.highestPotentialDpsValue?.value;

      const exceedsDamage = damageToCompare >= Number(minDps);

      return exceedsDamage;
    });

    setItemsToShow(
      filteredDetails.sort((a, b) => {
        const damageToCompareA = calculateForAmazonAscendancy
          ? a.calculatedDamageAmazonScaling.highestPotentialDpsValue?.value
          : a.calculatedDamage.highestPotentialDpsValue?.value;

        const damageToCompareB = calculateForAmazonAscendancy
          ? b.calculatedDamageAmazonScaling.highestPotentialDpsValue?.value
          : b.calculatedDamage.highestPotentialDpsValue?.value;

        return damageToCompareB - damageToCompareA;
      })
    );
  }, [itemDetails, calculateForAmazonAscendancy, minDps]);

  return (
    <div className="w-full overflow-hidden flex flex-col gap-5 card max-w-[1000px] mx-auto">
      <div className="flex gap-2 items-end justify-between">
        <div>
          <h1 className="text-2xl text-gray-200 font-bold">Manual Search</h1>

          <h2 className="text-gray-600">Wepon with Accuracy</h2>
        </div>

        <div className="flex gap-2">
          {isLoading && (
            <Button
              variant="danger"
              onClick={handleReset}
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Stop Search
            </Button>
          )}
          <Button
            variant="success"
            onClick={() => performSearch(searchUrl, body)}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </div>
      </div>

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

      <CollapsibleItem
        title="Search Settings"
        className="grid grid-cols-2 gap-2"
        defaultOpen={false}
      >
        <TextArea
          wrapperClassName="col-span-2"
          placeholder="{}"
          className="min-h-[280px]"
          type="text"
          label="Data:"
          value={body}
          onChange={(value) => {
            setBody(String(value));
            window.localStorage.setItem("manual-body", String(value));
          }}
        />
        <Input
          type="number"
          label="Minimum Dps (Always takes the Calculated higest overall highest DPS for comparison):"
          value={minDps}
          onChange={(value) => {
            setMinDps(Number(value));
            window.localStorage.setItem("manual-minDps", String(value));
          }}
          placeholder="400"
        />
        <Input
          type="number"
          label="Delay between requests (miliseconds, min 380 but watch out its easy to get rate limited):"
          value={delay}
          min={380}
          onChange={(value) => {
            setDelay(Number(value));
            window.localStorage.setItem("manual-delay", String(value));
          }}
          placeholder="500"
        />
        <Checkbox
          label="Calculate for Amazon Ascendancy:"
          checked={calculateForAmazonAscendancy}
          onChange={(value: boolean) => {
            setCalculateForAmazonAscendancy(value);
            window.localStorage.setItem(
              "manual-calculateForAmazonAscendancy",
              String(value)
            );
          }}
        />
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

        <Items
          items={itemsToShow}
          calculateForAmazonAscendancy={calculateForAmazonAscendancy}
          showSaveButton={true}
        />
      </div>
    </div>
  );
};

export default PoEManualSearch;
