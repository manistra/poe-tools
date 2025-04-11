import { useState, useCallback, useRef } from "react";
import { sleep } from "src/poe-tools/utils/sleep";

import { fetchItemDetails } from "src/poe-tools/api/fetchItemDetails";
import useLogs from "src/helpers/useLogs";
import { ItemData } from "../utils/calcs/types";
import { toast } from "react-hot-toast";
import { fetchItemIds } from "src/poe-tools/api/fetchItemIds";

interface UseManualSearchProps {
  setItemDetails: (items: ItemData[]) => void;
  delay?: number;
}

export const useManualSearch = ({
  setItemDetails,
  delay = 400,
}: UseManualSearchProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addLog, logs } = useLogs();

  // Add a ref to track if search should be cancelled
  const cancelRef = useRef(false);
  // Add a ref to store any timeout IDs that need to be cleared
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearListings = useCallback(() => {
    setItemDetails([]);
  }, []);

  // Add a function to cancel ongoing searches
  const cancelSearch = useCallback(() => {
    cancelRef.current = true;

    // Clear any pending timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setIsLoading(false);
    addLog("Search cancelled by user");
    toast.success("Search cancelled successfully");
  }, [addLog]);

  // Function to search for items directly
  const getItemIds = useCallback(
    async (queryData: any) => {
      try {
        addLog("Searching for items ");

        const response = await fetchItemIds(queryData);

        if (response.error) {
          const errorMessage = `Error Response: ${response.message}`;
          addLog(errorMessage);
          toast.error(errorMessage);
          return null;
        }

        addLog(`Search successful`);
        return response;
      } catch (e) {
        const errorMessage = `Search error: ${e}`;
        addLog(errorMessage);
        toast.error(errorMessage);
        return null;
      }
    },
    [addLog]
  );

  // Function to fetch item details
  const fetchItems = useCallback(
    async (searchResponse: any) => {
      if (
        !searchResponse ||
        !searchResponse.result ||
        !searchResponse.result.length
      ) {
        const message = "No items found in search response.";
        addLog(message);
        toast.error(message);
        return [];
      }

      const allResults = searchResponse.result;
      const allItems: any[] = [];

      // Process items in batches of 10
      for (let i = 0; i < allResults.length; i += 10) {
        // Check if search was cancelled
        if (cancelRef.current) {
          addLog("Search cancelled, stopping item fetch");
          return allItems;
        }

        const batchIds = allResults.slice(i, i + 10);
        if (batchIds.length === 0) break;

        addLog(
          `Fetching batch ${i / 10 + 1}/${Math.ceil(allResults.length / 10)} (${
            batchIds.length
          } items)`
        );

        try {
          const batchItems = await fetchItemDetails({
            itemIds: batchIds,
            isPoe2: true,
          });

          if (batchItems && batchItems.length) {
            allItems.push(...batchItems);
            addLog(`Successfully fetched batch ${i / 10 + 1}`);
          } else {
            const message = `No items returned in batch ${i / 10 + 1}`;
            addLog(message);
            toast.error(message);
          }
        } catch (e) {
          // Check if it's a rate limit error
          if (
            e instanceof Error &&
            e.message.startsWith("RATE_LIMIT_EXCEEDED")
          ) {
            const waitTimeMatch = e.message.match(/RATE_LIMIT_EXCEEDED:(\d+)/);
            const waitTime = waitTimeMatch
              ? parseInt(waitTimeMatch[1], 10)
              : 60;

            const message = `Rate limit exceeded. Waiting ${waitTime} seconds...`;
            addLog(message);
            toast.error(message);
            await sleep(waitTime * 1000);
            // Retry this batch
            i -= 10;
            continue;
          }

          const errorMessage = `Error fetching batch ${i / 10 + 1}: ${e}`;
          addLog(errorMessage);
          toast.error(errorMessage);
        }

        // Add delay between batches to prevent rate limiting
        if (i + 10 < allResults.length) {
          addLog("Waiting 1 second before next batch...");
          // Use a custom sleep that can be cancelled
          await new Promise<void>((resolve) => {
            timeoutRef.current = setTimeout(() => {
              timeoutRef.current = null;
              resolve();
            }, delay);
          });

          // Check again if cancelled after the delay
          if (cancelRef.current) {
            addLog("Search cancelled during delay");
            return allItems;
          }
        }
      }

      return allItems;
    },
    [addLog, delay]
  );

  // Main search function
  const performSearch = useCallback(
    async (bodyData: string) => {
      // Reset cancel flag at the start of a new search
      cancelRef.current = false;
      setIsLoading(true);
      clearListings();

      try {
        let queryData;
        try {
          queryData = JSON.parse(bodyData);
        } catch (e) {
          const errorMessage = `Error parsing JSON data: ${e}`;
          addLog(errorMessage);
          toast.error(errorMessage);
          setIsLoading(false);
          return;
        }

        addLog("Starting search...");
        const searchResponse = await getItemIds(queryData);

        if (!searchResponse.result.length) {
          const message = "Search failed or returned no results";
          addLog(message);
          toast.error(message);
          setIsLoading(false);
          return;
        }

        addLog(
          `Search successful! Found ${searchResponse.result.length} items.`
        );
        toast.success(`Found ${searchResponse.result.length} items!`);

        if (searchResponse.result.length > 0) {
          const items = await fetchItems(searchResponse);

          setItemDetails(items);
          if (items.length > 0) {
            toast.success(`Successfully fetched ${items.length} items`);
          } else {
            toast.error("No items could be fetched");
          }
        } else {
          const message = "No items found matching your criteria.";
          addLog(message);
          toast.error(message);
        }

        // Check if search was cancelled
        if (cancelRef.current) {
          addLog("Search cancelled");
          return;
        }
      } catch (error) {
        const errorMessage = `Error during search: ${error}`;
        addLog(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [addLog, clearListings, fetchItems, getItemIds]
  );

  return {
    clearListings,
    performSearch,
    isLoading,
    logs,
    cancelSearch,
  };
};
