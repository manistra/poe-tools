import React from "react";
import { useLiveSearch } from "./useLiveSearch";

const PoELiveSearch = () => {
  const {
    searchUrl,
    setSearchUrl,
    sessionId,
    setSessionId,
    isConnected,
    messages,
    error,
    connect,
    disconnect,
  } = useLiveSearch();

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
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>
              {msg.time}: New items: {msg.items.join(", ")}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PoELiveSearch;
