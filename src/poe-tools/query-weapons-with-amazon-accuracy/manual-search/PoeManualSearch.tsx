import React, { useEffect, useState } from "react";
import Button from "src/components/Button";

import CollapsibleItem from "src/components/CollapsibleItem";
import Input from "src/components/Input";
import TextArea from "src/components/TextArea";
import { useManualSearch } from "./useManualSearch";
import Item from "src/poe-tools/components/Item";
import { TransformedItemData } from "src/poe-tools/utils/transformItemData";

const PoEManualSearch = () => {
  const [itemDetails, setItemDetails] = useState<TransformedItemData[]>([]);
  const [itemsToShow, setItemsToShow] = useState<TransformedItemData[]>([]);

  const [delay, setDelay] = useState<number>(
    Number(window.localStorage.getItem("manual-delay")) || 400
  );

  const [minimumTotalDpsWithAccuracy, setMinimumTotalDpsWithAccuracy] =
    useState(
      window.localStorage.getItem("manual-minimumTotalDpsWithAccuracy") || 400
    );

  useState(
    window.localStorage.getItem("manual-minimumTotalDpsWithAccuracy") || 400
  );

  const [searchUrl, setSearchUrl] = useState(
    window.localStorage.getItem("manual-searchUrl") || ""
  );
  const [body, setBody] = useState(
    window.localStorage.getItem("manual-body") || ""
  );

  const { performSearch, isLoading, logs, clearListings } = useManualSearch({
    minimumTotalDpsWithAccuracy: Number(minimumTotalDpsWithAccuracy),
    setItemDetails,
    delay,
  });

  useEffect(() => {
    setItemsToShow(
      itemDetails
        .filter(
          (item) =>
            Number(item.dpsWithAccuracy) >= Number(minimumTotalDpsWithAccuracy)
        )
        .sort((a, b) => b.dpsWithAccuracy - a.dpsWithAccuracy)
    );
  }, [itemDetails]);

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
        defaultOpen={true}
      >
        <Input
          type="text"
          label="Search URL:"
          value={searchUrl}
          onChange={(value) => {
            setSearchUrl(String(value));
            window.localStorage.setItem("manual-searchUrl", String(value));
          }}
          placeholder="https://www.pathofexile.com/trade/search/League/SearchID"
        />

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
          label="Minimum Total DPS with Accuracy:"
          value={minimumTotalDpsWithAccuracy}
          onChange={(value) => {
            setMinimumTotalDpsWithAccuracy(Number(value));
            window.localStorage.setItem(
              "manual-minimumTotalDpsWithAccuracy",
              String(value)
            );
          }}
          placeholder="400"
        />
        <Input
          type="number"
          label="Delay:"
          value={delay}
          min={200}
          onChange={(value) => {
            setDelay(Number(value));
            window.localStorage.setItem("manual-delay", String(value));
          }}
          placeholder="500"
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
