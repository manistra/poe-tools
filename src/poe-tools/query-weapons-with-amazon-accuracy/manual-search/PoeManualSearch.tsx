import React, { useEffect, useState } from "react";
import Button from "src/components/Button";

import CollapsibleItem from "src/components/CollapsibleItem";
import Input from "src/components/Input";
import TextArea from "src/components/TextArea";
import { useManualSearch } from "./useManualSearch";
import Item from "src/poe-tools/components/Item";
import {
  ItemData,
  TransformedItemData,
  transformItemData,
} from "src/poe-tools/utils/transformItemData";

const PoEManualSearch = () => {
  const [itemDetails, setItemDetails] = useState<ItemData[]>([]);
  const [itemsToShow, setItemsToShow] = useState<TransformedItemData[]>([]);
  const [calculateForAmazonAscendancy, setCalculateForAmazonAscendancy] =
    useState(
      window.localStorage.getItem("manual-calculateForAmazonAscendancy") ===
        "true"
    );

  const [delay, setDelay] = useState<number>(
    Number(window.localStorage.getItem("manual-delay")) || 400
  );

  const [minDps, setMinDps] = useState(
    window.localStorage.getItem("manual-minDps") || 400
  );

  useState(window.localStorage.getItem("manual-minDps") || 400);

  const searchUrl =
    "https://www.pathofexile.com/api/trade2/search/poe2/Dawn%20of%20the%20Hunt";
  const [body, setBody] = useState(
    window.localStorage.getItem("manual-body") || ""
  );

  const { performSearch, isLoading, logs, clearListings } = useManualSearch({
    setItemDetails,
    delay,
  });

  useEffect(() => {
    const transformedItems = itemDetails.map((item) =>
      transformItemData(item, calculateForAmazonAscendancy)
    );

    setItemsToShow(
      transformedItems
        .filter(
          (item) =>
            Number(item.calculatedDamage.highestPotentialDpsValue?.value) >=
            Number(minDps)
        )
        .sort(
          (a, b) =>
            b.calculatedDamage.highestPotentialDpsValue?.value -
            a.calculatedDamage.highestPotentialDpsValue?.value
        )
    );
  }, [itemDetails, calculateForAmazonAscendancy, minDps]);

  return (
    <div className="w-full overflow-hidden flex flex-col gap-5 card max-w-[1000px] mx-auto">
      <div className="flex gap-2 items-end justify-between">
        <div>
          <h1 className="text-2xl text-gray-200 font-bold">
            Wepon with Accuracy
          </h1>

          <h2 className="text-gray-600">Manual Search</h2>
        </div>

        <Button
          variant="success"
          onClick={() => performSearch(searchUrl, body)}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? "Searching..." : "Search"}
        </Button>
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
        className="grid grid-cols-2 gap-2"
        defaultOpen={false}
      >
        <TextArea
          wrapperClassName="row-span-2"
          placeholder="{}"
          className="min-h-[110px]"
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
          label="Delay between requests (miliseconds, min 200 but watch out its easy to get rate limited):"
          value={delay}
          min={200}
          onChange={(value) => {
            setDelay(Number(value));
            window.localStorage.setItem("manual-delay", String(value));
          }}
          placeholder="500"
        />
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
                "manual-calculateForAmazonAscendancy",
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

        <ul className="space-y-4">
          {itemsToShow.map((item, index) => (
            <li key={index}>
              <Item item={item} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PoEManualSearch;
