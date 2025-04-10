import React, { useEffect, useState } from "react";
import { useLiveSearch } from "./useLiveSearch";
import { fetchItemDetails } from "../../utils/fetchItemDetails";
import { result } from "../../../mockData";
import Form from "../../components/Form";
import Items from "../../components/Items";
import { calculateTotalAccuracy } from "../../utils/calculateAccuracy";
import CollapsibleItem from "../../../components/CollapsibleItem";

const PoELiveSearch = () => {
  const {
    sessionId,
    setSessionId,
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
    useState(400);

  // Function to fetch item details when new messages arrive
  useEffect(() => {
    const fetchDetails = async () => {
      if (messages.length > 0) {
        const latestMessage = messages[messages.length - 1];
        if (latestMessage.items.length > 0) {
          setIsLoading(true);
          try {
            // Extract the search URL to determine if it's PoE2
            const isPoe2 = searchUrl.includes("poe2");

            const details = await fetchItemDetails({
              itemIds: latestMessage.items,
              sessionId,
              isPoe2,
              searchUrl,
            });

            const filteredDetails = details.filter(
              (detail) =>
                detail.item.extended.dps +
                  calculateTotalAccuracy(detail.item) / 4 >=
                minimumTotalDpsWithAccuracy
            );

            setItemDetails((prev) => [...filteredDetails, ...prev]);
          } catch (error) {
            console.error("Failed to fetch item details:", error);
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
    <div className="w-full overflow-hidden flex flex-col gap-5">
      <div className="flex gap-2 items-center">
        <div className="mr-auto flex flex-col gap-1">
          <label className="text-xs">Status: </label>

          {isConnected ? (
            <span className="text-green-500 animate-pulse">
              Connected, searching for items...
            </span>
          ) : (
            <span className="text-red-500">Disconnected</span>
          )}
          <span
            className={`${isConnected ? "text-green-500" : "text-red-500"}`}
          ></span>
          {error && <p style={{ color: "red" }}>Error: {error}</p>}
        </div>

        {!isConnected ? (
          <button
            className="bg-green-800 text-white px-4 py-2 rounded-md"
            onClick={connect}
            disabled={isConnected || !searchUrl || !sessionId}
          >
            Start Live Search
          </button>
        ) : (
          <button
            className="bg-red-900 text-white px-4 py-2 rounded-md"
            onClick={disconnect}
            disabled={!isConnected}
          >
            Stop Live Search
          </button>
        )}
      </div>

      <CollapsibleItem title="Connection Settings">
        <Form
          sessionId={sessionId}
          searchUrl={searchUrl}
          isConnected={isConnected}
          error={error}
          messages={messages}
          setSessionId={setSessionId}
          setSearchUrl={setSearchUrl}
          connect={connect}
          disconnect={disconnect}
        />
      </CollapsibleItem>

      <CollapsibleItem title="Messages:">
        <div>
          {messages.length === 0 ? (
            <p>No messages received yet</p>
          ) : (
            <ul>
              {messages.map((msg, index) => (
                <li key={index}>
                  {msg.time}: {msg.items.length} new items
                </li>
              ))}
            </ul>
          )}
        </div>
      </CollapsibleItem>

      <CollapsibleItem title="Search Settings" className="flex-wrap flex gap-2">
        <div className="flex flex-col gap-2">
          <label className="text-xs">Minimum Total DPS with Accuracy:</label>
          <input
            type="number"
            className="bg-slate-700 p-2 rounded-md w-fit"
            value={minimumTotalDpsWithAccuracy}
            onChange={(e) =>
              setMinimumTotalDpsWithAccuracy(Number(e.target.value))
            }
            placeholder="400"
          />
        </div>
      </CollapsibleItem>

      <div>
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold mb-2">Listings:</h3>
          <button
            className="hover:text-gray-400 rounded-md w-fit px-2 py-1 ml-auto text-gray-600"
            onClick={clearListings}
          >
            Clear Listings
          </button>
        </div>
        <Items items={itemDetails} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default PoELiveSearch;
