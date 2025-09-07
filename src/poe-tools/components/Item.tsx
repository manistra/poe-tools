import React, { useEffect, useState } from "react";
import { copyToClipboard } from "../utils/clipboard";

import Button from "src/components/Button";

import { TransformedItemData } from "../live-search/types";

import toast from "react-hot-toast";

import clsx from "clsx";
import ItemMods from "./ItemMods";
import { sendWhisper } from "../api/sendWhisper";

interface ItemProps {
  item: TransformedItemData;
  showSaveButton?: boolean;
}

const Item: React.FC<ItemProps> = ({
  item,

  showSaveButton,
}) => {
  const [listedAgo, setListedAgo] = useState<string>("");

  const [isWhispered, setIsWhispered] = useState<boolean>(false);
  const [isSendingWhisper, setIsSendingWhisper] = useState<boolean>(false);

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

  const handleCopyWhisper = async () => {
    await copyToClipboard(item.whisper);
    setIsWhispered(true);
    toast.success("Whisper copied to clipboard");
    // Optional: Add some visual feedback that the whisper was copied
  };

  const handleSendWhisper = async () => {
    if (!item.hideoutToken) {
      toast.error("No hideout token available for this item");
      return;
    }

    setIsSendingWhisper(true);
    try {
      const response = await sendWhisper({
        itemId: item.id,
        hideoutToken: item.hideoutToken,
        searchQueryId: item.searchQueryId,
      });

      if (response.success) {
        setIsWhispered(true);
        toast.success("Whisper sent successfully");
      } else {
        toast.error(response.error || "Failed to send whisper");
      }
    } catch (error) {
      console.error("Error sending whisper:", error);
      toast.error("Failed to send whisper");
    } finally {
      setIsSendingWhisper(false);
    }
  };

  return (
    <div
      className={clsx(
        "border border-gray-700 rounded-md  bg-gray-950 overflow-hidden",
        isWhispered && "opacity-40"
      )}
      onClick={() => {
        setIsWhispered(false);
      }}
    >
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

        <ItemMods item={item} />
      </div>

      <div className="flex justify-between items-end gap-4 p-2 pt-0">
        <div className="flex flex-col">
          <div className="text-[12px] text-gray-200 gap-2 flex items-center flex-row">
            <label className="text-gray-400">Pinged At:</label>
            <span className="text-gray-200">
              {item.pingedAt
                ? new Date(item.pingedAt).toLocaleTimeString()
                : "N/A"}
            </span>
          </div>

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
          <div className="flex flex-col items-center gap-2">
            <div className="text-sm text-gray-200 mr-2 flex flex-row items-center gap-2">
              <label className="text-xs text-gray-400">Price:</label>
              <span className="text-yellow-500 text-md text-nowrap">
                {item.price?.amount} {item.price?.currency}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <Button size="small" onClick={handleCopyWhisper}>
                Copy Whisper
              </Button>
              {item.hideoutToken && (
                <Button
                  size="small"
                  onClick={handleSendWhisper}
                  disabled={isSendingWhisper || isWhispered}
                  className={clsx(
                    isSendingWhisper && "opacity-50 cursor-not-allowed",
                    isWhispered && "bg-green-600 hover:bg-green-700"
                  )}
                >
                  {isSendingWhisper
                    ? "Sending..."
                    : isWhispered
                    ? "Sent"
                    : "Send Whisper"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Item;
