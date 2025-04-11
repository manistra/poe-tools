import { useState, useEffect } from "react";
import { useWebSocketConnection } from "./useWebSocketConnection";
import { fetchItemDetails } from "src/poe-tools/utils/fetchItemDetails";

import useLogs from "src/helpers/useLogs";
import { mockData } from "src/mockData";
import { getPoeSessionId } from "src/poe-tools/utils/getPoeSessionId";
import { ItemData } from "../utils/calcs/types";
import { toast } from "react-hot-toast";

interface UsePoeLiveSearchReturn {
  searchUrl: string;
  setSearchUrl: (url: string) => void;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  error: string | null;
  logs: string[];
  itemDetails: ItemData[];
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
            addLog(`Fetched item details for ${details.length} items`);

            setItemDetails((prev) => [...details, ...prev]);
          } catch (error) {
            // Handle rate limit errors
            disconnect();
            const errorMessage = `🛑 Search automatically stopped due to an error!`;
            addLog(errorMessage);
            toast.error(errorMessage);

            if (
              error instanceof Error &&
              error.message.startsWith("RATE_LIMIT_EXCEEDED")
            ) {
              const waitTime = error.message.split(":")[1];
              const rateMessage = `⚠️ Rate limit exceeded! Need to wait ${waitTime} seconds before trying again.`;
              addLog(rateMessage);
              toast.error(rateMessage);
            } else {
              console.error("Failed to fetch item details:", error);
              const fetchErrorMessage = `Error fetching item details: ${
                error instanceof Error ? error.message : String(error)
              }`;
              addLog(fetchErrorMessage);
              toast.error(fetchErrorMessage);
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
    toast.success("Listings cleared");
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
