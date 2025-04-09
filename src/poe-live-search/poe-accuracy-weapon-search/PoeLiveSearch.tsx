import React, { useEffect } from "react";
import { useLiveSearch } from "./useLiveSearch";
import { fetchItemDetails } from "./fetchItemDetails";

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

  const [itemDetails, setItemDetails] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

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
            setItemDetails(details);
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

  return (
    <div>
      <h2>PoE Live Search Connection</h2>

      <div>
        <label>
          Session ID:
          <input
            type="text"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            placeholder="Your PoE Session ID"
          />
        </label>
      </div>

      <div>
        <label>
          Trade URL:
          <input
            type="text"
            value={searchUrl}
            onChange={(e) => setSearchUrl(e.target.value)}
            placeholder="https://www.pathofexile.com/trade/search/League/SearchID"
          />
        </label>
      </div>

      <div>
        <button
          onClick={connect}
          disabled={isConnected || !searchUrl || !sessionId}
        >
          Connect
        </button>
        <button onClick={disconnect} disabled={!isConnected}>
          Disconnect
        </button>
      </div>

      <div>
        <h3>Status: {isConnected ? "Connected" : "Disconnected"}</h3>
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
      </div>

      <div>
        <h3>Messages:</h3>
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

      <div>
        <h3>Latest Item Details:</h3>
        {isLoading ? (
          <p>Loading item details...</p>
        ) : itemDetails.length > 0 ? (
          <ul>
            {itemDetails.map((item, index) => (
              <li key={index}>
                <pre>{JSON.stringify(item, null, 2)}</pre>
              </li>
            ))}
          </ul>
        ) : (
          <p>No item details available</p>
        )}
      </div>
    </div>
  );
};

export default PoELiveSearch;
