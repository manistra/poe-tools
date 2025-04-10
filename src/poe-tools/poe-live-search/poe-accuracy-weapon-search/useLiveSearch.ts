import { useState, useEffect } from "react";
import { getPoeSessionId } from "src/poe-tools/utils/getPoeSessionId";

declare global {
  interface Window {
    electron: {
      api: {
        request: (options: {
          url: string;
          method: string;
          headers?: Record<string, string>;
          data?: any;
          params?: Record<string, string>;
        }) => Promise<any>;
      };
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
  isConnected: boolean;
  messages: Message[];
  error: string | null;
  connect: () => void;
  disconnect: () => void;
}

export const useLiveSearch = (): UseLiveSearchReturn => {
  const [searchUrl, setSearchUrl] = useState(
    window.localStorage.getItem("searchUrl") || ""
  );
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<{ time: string; items: string[] }[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);

  const sessionId = getPoeSessionId();

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
    isConnected,
    messages,
    error,
    connect,
    disconnect,
  };
};
