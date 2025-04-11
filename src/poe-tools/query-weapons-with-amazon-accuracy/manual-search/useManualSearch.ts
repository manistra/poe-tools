import { useState, useCallback, useRef } from "react";
import { sleep } from "src/poe-tools/utils/sleep";
import { getPoeSessionId } from "src/poe-tools/utils/getPoeSessionId";

import { fetchItemDetails } from "src/poe-tools/utils/fetchItemDetails";
import useLogs from "src/helpers/useLogs";
import { ItemData } from "../utils/calcs/types";

// Function to create headers with the provided POESESSID
const createHeaders = (poesessid: string) => {
  return {
    "Content-Type": "application/json",
    "User-Agent": "anything",
    Cookie: `POESESSID=${poesessid}`,
    Accept: "*/*",
    "Accept-Language": "en-GB,en;q=0.9",
    Connection: "keep-alive",
    Origin: "https://www.pathofexile.com",
    Referer: "https://www.pathofexile.com/trade",
    "X-Requested-With": "XMLHttpRequest",
    Host: "www.pathofexile.com",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
  };
};

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
  }, [addLog]);

  // Function to search for items directly
  const searchItems = useCallback(
    async (searchUrl: string, queryData: any) => {
      try {
        addLog("Searching for items ");

        const response = await window.electron.api.request({
          url: searchUrl,
          method: "POST",
          headers: createHeaders(getPoeSessionId()),
          data: queryData,
        });

        if (response.error) {
          addLog(`Error Response: ${response.message}`);
          return null;
        }

        addLog(`Search successful`);
        return response;
      } catch (e) {
        addLog(`Search error: ${e}`);
        return null;
      }
    },
    [addLog]
  );

  // Function to fetch item details
  const fetchItems = useCallback(
    async (searchResponse: any, searchUrl: string) => {
      if (
        !searchResponse ||
        !searchResponse.result ||
        !searchResponse.result.length
      ) {
        addLog("No items found in search response.");
        return [];
      }

      const allResults = searchResponse.result;
      const allItems: any[] = [];
      const isPoe2 = searchUrl.includes("trade2") || searchUrl.includes("poe2");

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
            sessionId: getPoeSessionId(),
            isPoe2,
            searchUrl,
          });

          if (batchItems && batchItems.length) {
            allItems.push(...batchItems);
            addLog(`Successfully fetched batch ${i / 10 + 1}`);
          } else {
            addLog(`No items returned in batch ${i / 10 + 1}`);
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

            addLog(`Rate limit exceeded. Waiting ${waitTime} seconds...`);
            await sleep(waitTime * 1000);
            // Retry this batch
            i -= 10;
            continue;
          }

          addLog(`Error fetching batch ${i / 10 + 1}: ${e}`);
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
    async (searchUrl: string, bodyData: string) => {
      // Reset cancel flag at the start of a new search
      cancelRef.current = false;
      setIsLoading(true);
      clearListings();

      try {
        let queryData;
        try {
          queryData = JSON.parse(bodyData);
        } catch (e) {
          addLog(`Error parsing JSON data: ${e}`);
          setIsLoading(false);
          return;
        }

        addLog("Starting search...");
        const searchResponse = await searchItems(searchUrl, queryData);

        if (!searchResponse) {
          addLog("Search failed or returned no results");
          setIsLoading(false);
          return;
        }

        addLog(
          `Search successful! Found ${searchResponse.result.length} items.`
        );

        if (searchResponse.result.length > 0) {
          const items = await fetchItems(searchResponse, searchUrl);

          setItemDetails(items);
        } else {
          addLog("No items found matching your criteria.");
        }

        // Check if search was cancelled
        if (cancelRef.current) {
          addLog("Search cancelled");
          return;
        }
      } catch (error) {
        addLog(`Error during search: ${error}`);
      } finally {
        setIsLoading(false);
      }
    },
    [addLog, clearListings, fetchItems, searchItems]
  );

  return {
    clearListings,
    performSearch,
    isLoading,
    logs,
    cancelSearch,
  };
};
