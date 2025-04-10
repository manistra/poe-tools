import React, { useState, useEffect } from "react";
import Button from "src/components/Button";
import CollapsibleItem from "src/components/CollapsibleItem";
import Input from "src/components/Input";
import useLogs from "src/helpers/useLogs";
import { result } from "src/mockData";
import Items from "src/poe-tools/components/Items";
import { calculateTotalAccuracy } from "src/poe-tools/utils/calculateAccuracy";
import { fetchItemDetails } from "src/poe-tools/utils/fetchItemDetails";
import { useLiveSearch } from "./useLiveSearch";
import clsx from "clsx";
import { sendNotification } from "src/poe-tools/utils/useNotification";

const PoELiveSearch = () => {
  const {
    sessionId,
    setSearchUrl,
    searchUrl,
    isConnected,
    messages,
    error,
    connect,
    disconnect,
  } = useLiveSearch();

  const [itemDetails, setItemDetails] = useState<any[]>(result);
  const [isLoading, setIsLoading] = useState(false);
  const [minimumTotalDpsWithAccuracy, setMinimumTotalDpsWithAccuracy] =
    useState(window.localStorage.getItem("minimumTotalDpsWithAccuracy") || 400);

  const { logs, addLog } = useLogs();

  // Function to fetch item details when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      if (latestMessage.items && latestMessage.items.length > 0) {
        addLog(`New items found: ${latestMessage.items.length} items`);
      }
    }

    const fetchDetails = async () => {
      if (messages.length > 0) {
        const latestMessage = messages[messages.length - 1];
        if (latestMessage.items.length > 0) {
          setIsLoading(true);
          try {
            // Extract the search URL to determine if it's PoE2
            const isPoe2 = searchUrl.includes("poe2");
            addLog(
              `Fetching item details for ${latestMessage.items.length} items`
            );
            const details = await fetchItemDetails({
              itemIds: latestMessage.items,
              sessionId,
              isPoe2,
              searchUrl,
            });

            const filteredDetails = details.filter((detail) => {
              const damageWithAccuracy =
                detail.item.extended.dps +
                calculateTotalAccuracy(detail.item) / 4;

              const exceedsDamage =
                damageWithAccuracy >= minimumTotalDpsWithAccuracy;

              if (exceedsDamage) {
                sendNotification(
                  `${damageWithAccuracy} DPS (crit: ${
                    detail.item.properties.find(
                      (property: any) =>
                        property.name === "[Critical|Critical Hit] Chance"
                    )?.values[0][0]
                  }) for ${detail.listing?.price?.amount} ${
                    detail.listing?.price?.currency
                  }`,
                  `${detail.item.name} exceeds ${minimumTotalDpsWithAccuracy} DPS with Accuracy`
                );
              }

              return exceedsDamage;
            });

            setItemDetails((prev) => [
              ...filteredDetails.map((detail) => ({
                time: new Date().toLocaleTimeString(),
                ...detail,
              })),
              ...prev,
            ]);
          } catch (error) {
            // Handle rate limit errors
            disconnect();
            addLog(`🛑 Search automatically stopped due to an error!`);

            if (
              error instanceof Error &&
              error.message.startsWith("RATE_LIMIT_EXCEEDED")
            ) {
              const waitTime = error.message.split(":")[1];
              addLog(
                `⚠️ Rate limit exceeded! Need to wait ${waitTime} seconds before trying again.`
              );
            } else {
              console.error("Failed to fetch item details:", error);
              addLog(
                `Error fetching item details: ${
                  error instanceof Error ? error.message : String(error)
                }`
              );
            }
          } finally {
            setIsLoading(false);
          }
        }
      }
    };

    fetchDetails();
  }, [messages]);

  const clearListings = () => {
    setItemDetails([]);
  };

  return (
    <div className="w-full overflow-hidden flex flex-col gap-5 card max-w-[1000px] mx-auto">
      <div className="flex gap-2 items-end justify-between">
        <div>
          <h1 className="text-2xl text-gray-200 font-bold">
            Wepon with Accuracy
          </h1>

          <h2 className="text-gray-600">Live Search</h2>
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
              disabled={isConnected || !searchUrl || !sessionId}
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
                "minimumTotalDpsWithAccuracy",
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
        <Items items={itemDetails} />
      </div>
    </div>
  );
};

export default PoELiveSearch;
