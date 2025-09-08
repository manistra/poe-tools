import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { SearchConfig } from "../utils/types";
import { getActiveSearchConfigs } from "../utils/searchConfigManager";

interface Message {
  time: string;
  items: string[];
  searchId: string;
  searchLabel: string;
}

interface ConnectionStatus {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
}

interface WebSocketConnectionContextType {
  messages: Message[];
  connectionStatuses: Map<string, ConnectionStatus>;
  hasActiveConnections: boolean;
  totalConnections: number;
  connectAll: (configs: SearchConfig[]) => void;
  disconnectAll: () => void;
  connectIndividual: (config: SearchConfig) => void;
  disconnectIndividual: (searchId: string) => void;
  clearMessages: () => void;
}

const WebSocketConnectionContext = createContext<
  WebSocketConnectionContextType | undefined
>(undefined);

interface WebSocketConnectionProviderProps {
  children: ReactNode;
}

export const WebSocketConnectionProvider: React.FC<
  WebSocketConnectionProviderProps
> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [connectionStatuses, setConnectionStatuses] = useState<
    Map<string, ConnectionStatus>
  >(new Map());
  const [activeConnections, setActiveConnections] = useState<Set<string>>(
    new Set()
  );

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

  const connectAll = useCallback((configs: SearchConfig[]) => {
    console.log("🔌 Simple connectAll called with configs:", configs);

    // Disconnect all existing connections first
    disconnectAll();

    // Set all configs to loading state
    setConnectionStatuses((prev) => {
      const newStatuses = new Map(prev);
      configs.forEach((config) => {
        if (config.isActive) {
          newStatuses.set(config.id, {
            isConnected: false,
            isLoading: true,
            error: null,
          });
        }
      });
      return newStatuses;
    });

    // Connect to each active config with a delay
    configs.forEach((config, index) => {
      if (config.isActive) {
        const wsUri = getWebSocketUri(config.url);
        if (wsUri) {
          // Add delay between connections to respect rate limits
          setTimeout(async () => {
            console.log(`🔌 Connecting to: ${config.label}`);
            const sessionId = await (
              window.electron.api as any
            ).getPoeSessionId();
            (window.electron.websocket as any).connect(
              wsUri,
              sessionId,
              config.id
            );
          }, index * 2000); // 2 second delay between each connection
        }
      }
    });
  }, []);

  const disconnectAll = useCallback(() => {
    console.log("🔌 Simple disconnectAll called");
    window.electron.websocket.disconnect();
    setActiveConnections(new Set());
    setConnectionStatuses(new Map());
  }, []);

  const connectIndividual = useCallback(async (config: SearchConfig) => {
    console.log(`🔌 Connecting to individual search: ${config.label}`);

    // Set loading state
    setConnectionStatuses((prev) => {
      const newStatuses = new Map(prev);
      newStatuses.set(config.id, {
        isConnected: false,
        isLoading: true,
        error: null,
      });
      return newStatuses;
    });

    const wsUri = getWebSocketUri(config.url);
    if (wsUri) {
      const sessionId = await (window.electron.api as any).getPoeSessionId();
      (window.electron.websocket as any).connect(wsUri, sessionId, config.id);
    }
  }, []);

  const disconnectIndividual = useCallback((searchId: string) => {
    console.log(`🔌 Disconnecting individual search: ${searchId}`);
    (window.electron.websocket as any).disconnect(searchId);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // Set up event listeners
  useEffect(() => {
    const removeConnectedListener = (
      window.electron.websocket as any
    ).onConnected((searchId: string) => {
      console.log(`🔌 Connected to search: ${searchId}`);
      setActiveConnections((prev) => new Set([...prev, searchId]));
      setConnectionStatuses((prev) => {
        const newStatuses = new Map(prev);
        newStatuses.set(searchId, {
          isConnected: true,
          isLoading: false,
          error: null,
        });
        return newStatuses;
      });
    });

    const removeDisconnectedListener = (
      window.electron.websocket as any
    ).onDisconnected((searchId: string) => {
      console.log(`🔌 Disconnected from search: ${searchId}`);
      setActiveConnections((prev) => {
        const newSet = new Set(prev);
        newSet.delete(searchId);
        return newSet;
      });
      setConnectionStatuses((prev) => {
        const newStatuses = new Map(prev);
        newStatuses.set(searchId, {
          isConnected: false,
          isLoading: false,
          error: null,
        });
        return newStatuses;
      });
    });

    const removeMessageListener = (window.electron.websocket as any).onMessage(
      (searchId: string, data: unknown) => {
        console.log(`🔌 Received message from ${searchId}:`, data);
        const messageData = data as { new?: string[] };
        if (messageData.new && messageData.new.length > 0) {
          // Find the search config to get the label
          const configs = getActiveSearchConfigs();
          const config = configs.find((c) => c.id === searchId);

          const newMessage: Message = {
            time: new Date().toLocaleTimeString(),
            items: messageData.new,
            searchId,
            searchLabel: config?.label || "Unknown Search",
          };

          console.log(
            `🔌 Adding new message with ${messageData.new.length} items:`,
            newMessage
          );
          setMessages((prev) => [newMessage, ...prev]);
        } else {
          console.log(`🔌 Message from ${searchId} has no new items:`, data);
        }
      }
    );

    const removeErrorListener = (window.electron.websocket as any).onError(
      (searchId: string, errorMsg: string) => {
        console.error(`🔌 WebSocket error for ${searchId}:`, errorMsg);
        setConnectionStatuses((prev) => {
          const newStatuses = new Map(prev);
          newStatuses.set(searchId, {
            isConnected: false,
            isLoading: false,
            error: errorMsg,
          });
          return newStatuses;
        });
      }
    );

    // Clean up listeners on unmount
    return () => {
      removeConnectedListener();
      removeDisconnectedListener();
      removeMessageListener();
      removeErrorListener();
      disconnectAll();
    };
  }, [disconnectAll]);

  const contextValue: WebSocketConnectionContextType = {
    messages,
    connectionStatuses,
    hasActiveConnections: activeConnections.size > 0,
    totalConnections: activeConnections.size,
    connectAll,
    disconnectAll,
    connectIndividual,
    disconnectIndividual,
    clearMessages,
  };

  return (
    <WebSocketConnectionContext.Provider value={contextValue}>
      {children}
    </WebSocketConnectionContext.Provider>
  );
};

export const useWebSocketConnection = (): WebSocketConnectionContextType => {
  const context = useContext(WebSocketConnectionContext);
  if (context === undefined) {
    throw new Error(
      "useWebSocketConnection must be used within a WebSocketConnectionProvider"
    );
  }
  return context;
};
