import { useState, useEffect } from "react";

declare global {
  interface Window {
    electron: {
      websocket: {
        connect: (wsUri: string, sessionId: string) => void;
        disconnect: () => void;
        onConnected: (callback: () => void) => () => void;
        onDisconnected: (callback: () => void) => () => void;
        onMessage: (callback: (data: any) => void) => () => void;
        onError: (callback: (error: string) => void) => () => void;
      };
    };
  }
}

interface Message {
  time: string;
  items: string[];
}

interface UseLiveSearchReturn {
  searchUrl: string;
  setSearchUrl: (url: string) => void;
  sessionId: string;
  setSessionId: (id: string) => void;
  isConnected: boolean;
  messages: Message[];
  error: string | null;
  connect: () => void;
  disconnect: () => void;
}

export const useLiveSearch = (): UseLiveSearchReturn => {
  const [searchUrl, setSearchUrl] = useState(
    "https://www.pathofexile.com/trade2/search/poe2/Dawn%20of%20the%20Hunt/neo0a8Mt0/live"
  );
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<{ time: string; items: string[] }[]>(
    []
  );
  const [sessionId, setSessionId] = useState(
    "b3d08bb568a0c48c7a5cd08f681cd73a"
  );
  const [error, setError] = useState<string | null>(null);

  // Extract WebSocket URI from trade URL
  const getWebSocketUri = (url: string) => {
    const poeTradeUrlRegex =
      /\/([a-zA-Z0-9]+)\/search\/(?:poe2\/)?([a-zA-Z0-9%]+)\/([a-zA-Z0-9]+)/;
    const matchDetails = url.match(poeTradeUrlRegex);

    if (!matchDetails) return null;

    const [, game, league, id] = matchDetails;

    if (game === "trade") {
      return `wss://www.pathofexile.com/api/trade/live/${league}/${id}`;
    }
    return `wss://www.pathofexile.com/api/trade2/live/poe2/${league}/${id}`;
  };

  const connect = () => {
    const wsUri = getWebSocketUri(searchUrl);

    if (!wsUri) {
      alert("Invalid search URL");
      return;
    }

    setError(null);
    window.electron.websocket.connect(wsUri, sessionId);
  };

  const disconnect = () => {
    window.electron.websocket.disconnect();
  };

  // Set up event listeners
  useEffect(() => {
    const removeConnectedListener = window.electron.websocket.onConnected(
      () => {
        setIsConnected(true);
        console.log("Connected to WebSocket");
      }
    );

    const removeDisconnectedListener = window.electron.websocket.onDisconnected(
      () => {
        setIsConnected(false);
        console.log("Disconnected from WebSocket");
      }
    );

    const removeMessageListener = window.electron.websocket.onMessage(
      (data) => {
        console.log("Received message:", data);
        if (data.new && data.new.length > 0) {
          setMessages((prev) => [
            ...prev,
            {
              time: new Date().toLocaleTimeString(),
              items: data.new,
            },
          ]);
        }
      }
    );

    const removeErrorListener = window.electron.websocket.onError(
      (errorMsg) => {
        console.error("WebSocket error:", errorMsg);
        setError(errorMsg);
        setIsConnected(false);
      }
    );

    // Clean up listeners on unmount
    return () => {
      removeConnectedListener();
      removeDisconnectedListener();
      removeMessageListener();
      removeErrorListener();
      disconnect();
    };
  }, []);

  return {
    searchUrl,
    setSearchUrl: (url: string) => {
      window.localStorage.setItem("searchUrl", url);
      setSearchUrl(url);
    },
    sessionId,
    setSessionId: (id: string) => {
      window.localStorage.setItem("poeSessionId", id);
      setSessionId(id);
    },
    isConnected,
    messages,
    error,
    connect,
    disconnect,
  };
};
