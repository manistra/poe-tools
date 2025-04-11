import React, { useEffect, useState } from "react";
import { copyToClipboard } from "../utils/clipboard";
import CollapsibleItem from "../../components/CollapsibleItem";
import Button from "src/components/Button";

import { TransformedItemData } from "../query-weapons-with-amazon-accuracy/utils/calcs/types";
import ItemCalculatedDamage from "./ItemDamageStates";
import Checkbox from "src/components/Checkbox";
import toast from "react-hot-toast";
import { checkItemPrice } from "../api/checkItemPrice";

const WhisperButton = ({ whisper }: { whisper: string }) => {
  const handleCopyWhisper = async () => {
    await copyToClipboard(whisper);
    toast.success("Whisper copied to clipboard");
    // Optional: Add some visual feedback that the whisper was copied
  };

  return (
    <Button size="small" onClick={handleCopyWhisper}>
      Copy Whisper
    </Button>
  );
};

interface ItemProps {
  item: TransformedItemData;
  calculateForAmazonAscendancy?: boolean;
  showSaveButton?: boolean;
  automaticallyCheckPrice?: boolean;
}

const Item: React.FC<ItemProps> = ({
  item,
  calculateForAmazonAscendancy,
  showSaveButton,
  automaticallyCheckPrice = false,
}) => {
  const [amazonLocal, setAmazonLocal] = useState(calculateForAmazonAscendancy);
  const [listedAgo, setListedAgo] = useState<string>("");
  const [checkedPrices, setCheckedPrices] = useState<{
    url: string;
    prices: string[];
  }>({ url: "", prices: [] });
  const [isPriceChecking, setIsPriceChecking] = useState(false);

  // Calculate and format the time difference
  const calculateTimeDifference = () => {
    if (!item.listedAt) return "Unknown";

    const listedDate = new Date(item.listedAt);
    const now = new Date();
    const diffMs = now.getTime() - listedDate.getTime();

    // If less than a minute
    if (diffMs < 60000) {
      return "Just now";
    }

    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
    }

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    }

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  };

  // Update the time difference initially and every 2 minutes
  useEffect(() => {
    setListedAgo(calculateTimeDifference());

    const intervalId = setInterval(() => {
      setListedAgo(calculateTimeDifference());
    }, 120000); // 2 minutes in milliseconds

    return () => clearInterval(intervalId);
  }, [item.listedAt]);

  useEffect(() => {
    setAmazonLocal(calculateForAmazonAscendancy);
  }, [calculateForAmazonAscendancy]);

  // Auto price check effect
  useEffect(() => {
    if (
      automaticallyCheckPrice &&
      !checkedPrices?.prices?.length &&
      !isPriceChecking
    ) {
      handleCheckPrice();
    }
  }, [automaticallyCheckPrice, item.id, checkedPrices?.prices?.length]);

  const handleSaveItem = () => {
    const savedItems = JSON.parse(
      window.localStorage.getItem("savedItems") || "[]"
    );
    const itemExists = savedItems.some(
      (savedItem: TransformedItemData) => savedItem.id === item.id
    );

    if (itemExists) {
      toast.error("Item already saved");
      return;
    }

    const newSavedItems = [...savedItems, item];
    window.localStorage.setItem("savedItems", JSON.stringify(newSavedItems));
    console.log("Saving item");
    toast.success("Item saved");
  };

  const handleCheckPrice = async () => {
    try {
      setIsPriceChecking(true);
      const prices = await checkItemPrice(item);
      setCheckedPrices(prices);
    } catch (error) {
      console.error("Error checking price:", error);
      toast.error("Failed to check price");
    } finally {
      setIsPriceChecking(false);
    }
  };

  return (
    <div className="border border-gray-700 rounded-md  bg-gray-950 overflow-hidden">
      <div className=" w-full border-b border-gray-700 bg-gradient-to-r from-gray-950 to-orange-950 p-2 flex-row flex justify-between">
        <div className="flex flex-row gap-2 items-center">
          {showSaveButton && (
            <button
              className="text-xs font-bold text-gray-400"
              onClick={handleSaveItem}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5 hover:text-gray-200 transition-colors duration-200"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                />
              </svg>
            </button>
          )}
          <span className="text-gray-200 text-base font-bold">{item.name}</span>
        </div>

        <span className="flex flex-row gap-2 items-center">
          <label className="text-xs text-gray-400">Amazon Scaling</label>
          <Checkbox
            className="w-4 h-4"
            checked={amazonLocal}
            onChange={(value: boolean) => {
              setAmazonLocal(value);
            }}
          />
        </span>
      </div>
      <div className="flex flex-col gap-2 p-2">
        <ItemCalculatedDamage
          item={item}
          calculateForAmazonAscendancy={amazonLocal}
          totalDpsNoAmazonScaling={
            item.calculatedDamage.highestPotentialDpsValue?.value
          }
          calculatedDamage={
            amazonLocal
              ? item.calculatedDamageAmazonScaling
              : item.calculatedDamage
          }
        />

        <CollapsibleItem title="Mods">
          <div className="flex flex-col gap-1">
            {item.runeMods && item.runeMods.length > 0 && (
              <>
                <h4 className="text-sm text-gray-400">Rune Mods:</h4>
                <div className="bg-gray-900 p-2 rounded">
                  {item.runeMods.map((mod: string, i: number) => (
                    <div key={i} className="text-sm">
                      {mod}
                    </div>
                  ))}
                </div>
              </>
            )}
            {item.fracturedMods && item.fracturedMods.length > 0 && (
              <>
                <h4 className="text-sm text-gray-400">Fractured Mods:</h4>
                <div className="bg-gray-900 p-2 rounded">
                  {item.fracturedMods.map((mod: string, i: number) => (
                    <div key={i} className="text-sm">
                      {mod}
                    </div>
                  ))}
                </div>
              </>
            )}
            <h4 className="text-sm text-gray-400">Mods:</h4>
            <div className="bg-gray-900 p-2 rounded">
              {item.explicitMods?.map((mod: string, i: number) => (
                <div key={i} className="text-sm">
                  {mod}
                </div>
              ))}
            </div>
          </div>
        </CollapsibleItem>
      </div>

      <div className="flex justify-between items-end gap-4 p-2 pt-0">
        <div className="flex flex-col">
          <div className="text-[12px] text-gray-200 gap-2 flex items-center flex-row">
            <label className="text-gray-400">Seller:</label>
            <span className="text-gray-200">{item.seller}</span>
          </div>

          <div className="text-[12px] text-gray-200 gap-2 flex items-center flex-row">
            <label className="text-gray-400">Listed:</label>
            <span className="text-gray-200">{listedAgo} </span>
          </div>
        </div>

        <div className="flex flex-row items-end gap-2">
          {isPriceChecking ? (
            <div className="flex items-center justify-center p-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : checkedPrices?.prices?.length ? (
            <div>
              <span className="text-[9px] text-gray-300">
                Showing first 4 compared prices:
              </span>
              <div className="flex flex-col gap-1 border-gray-700 border-t">
                <div className="flex flex-wrap">
                  <span className="text-gray-200 text-[11px]">
                    <span className="text-purple-400 mr-[2px]">[</span>
                    {checkedPrices.prices.join(", ")}
                    <span className="text-purple-400 ml-[2px]">]</span>
                  </span>
                </div>
                <Button
                  className="bg-gradient-to-r from-purple-950 to-gray-900 mt-auto"
                  size="small"
                  onClick={() => {
                    const url =
                      checkedPrices.url || "https://www.pathofexile.com/trade";
                    window.electron.shell.openExternal(url);
                  }}
                >
                  Open on Poe Trade
                </Button>
              </div>
            </div>
          ) : (
            <Button
              size="small"
              onClick={handleCheckPrice}
              className="bg-gradient-to-r from-purple-950 to-gray-900"
            >
              Check Price
            </Button>
          )}

          <div className="flex flex-col items-center gap-2">
            <div className="text-sm text-gray-200 mr-2 flex flex-row items-center gap-2">
              <label className="text-xs text-gray-400">Price:</label>
              <span className="text-yellow-500 text-md text-nowrap">
                {item.price?.amount} {item.price?.currency}
              </span>
            </div>
            <WhisperButton whisper={item.whisper} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Item;
