import { useState, useEffect } from "react";
import { useWebSocketConnection } from "./useWebSocketConnection";
import { fetchItemDetails } from "src/poe-tools/utils/fetchItemDetails";
import {
  TransformedItemData,
  transformItemData,
} from "src/poe-tools/utils/transformItemData";

import useLogs from "src/helpers/useLogs";
import { mockData } from "src/mockData";
import { getPoeSessionId } from "src/poe-tools/utils/getPoeSessionId";

interface UsePoeLiveSearchReturn {
  searchUrl: string;
  setSearchUrl: (url: string) => void;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  error: string | null;
  logs: string[];
  itemDetails: TransformedItemData[];
  isLoading: boolean;
  clearListings: () => void;
}

export const usePoeLiveSearch = (): UsePoeLiveSearchReturn => {
  const [itemDetails, setItemDetails] = useState<any[]>(mockData);
  const [isLoading, setIsLoading] = useState(false);

  const {
    setSearchUrl,
    searchUrl,
    isConnected,
    messages,
    error,
    connect,
    disconnect,
  } = useWebSocketConnection();

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
              sessionId: getPoeSessionId(),
              isPoe2,
              searchUrl,
            });

            const transformedDetails = details.map((detail) =>
              transformItemData(detail)
            );

            setItemDetails((prev) => [
              ...transformedDetails.map((detail) => ({
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
  return {
    searchUrl,
    setSearchUrl,
    isConnected,
    connect,
    disconnect,
    error,
    logs,
    itemDetails,
    isLoading,
    clearListings,
  };
};
