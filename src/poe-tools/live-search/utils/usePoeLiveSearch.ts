import { useState, useEffect, useCallback } from "react";

import { fetchItemDetails } from "src/poe-tools/api/fetchItemDetails";

import useLogs from "src/helpers/useLogs";
import { ItemData, SearchConfig } from "./types";
import { toast } from "react-hot-toast";
import { useSimpleMultiWebSocket } from "./useSimpleMultiWebSocket";
import { getActiveSearchConfigs } from "./searchConfigManager";
import { sendNotification } from "../../utils/useNotification";

interface UsePoeLiveSearchReturn {
  searchUrls: string[];
  setSearchUrls: (urls: string[]) => void;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  error: string | null;
  logs: string[];
  itemDetails: ItemData[];
  isLoading: boolean;
  clearListings: () => void;
  activeSearchConfigs: SearchConfig[];
  updateCurrentSearchUrl: (url: string) => void;
  connectionStatuses: Map<
    string,
    { isConnected: boolean; error: string | null }
  >;
  hasActiveConnections: boolean;
  totalConnections: number;
  autoWhisper: boolean;
  toggleAutoWhisper: () => void;
  whisperCooldown: number;
  clearWhisperCooldown: () => void;
}

export const usePoeLiveSearch = (): UsePoeLiveSearchReturn => {
  const [itemDetails, setItemDetails] = useState<ItemData[]>([]);
  const [isLoading] = useState(false);
  const [activeSearchConfigs, setActiveSearchConfigs] = useState<
    SearchConfig[]
  >([]);
  const [searchUrls, setSearchUrls] = useState<string[]>([]);
  const [processedMessageIds, setProcessedMessageIds] = useState<Set<string>>(
    new Set()
  );
  const [autoWhisper, setAutoWhisper] = useState<boolean>(() => {
    const stored = localStorage.getItem("poe-auto-whisper");
    return stored ? JSON.parse(stored) : false;
  });
  const [lastWhisperTime, setLastWhisperTime] = useState<number>(0);
  const [whisperCooldown, setWhisperCooldown] = useState<number>(0);

  const {
    messages,
    connectionStatuses,
    hasActiveConnections,
    totalConnections,
    connectAll,
    disconnectAll,
    clearMessages,
  } = useSimpleMultiWebSocket();

  const { logs, addLog } = useLogs();

  // Load active search configs on mount (but don't auto-connect)
  useEffect(() => {
    console.log("🔧 usePoeLiveSearch useEffect called - loading configs");
    const configs = getActiveSearchConfigs();
    console.log("🔧 Loaded configs:", configs);
    setActiveSearchConfigs(configs);
    setSearchUrls(configs.map((config) => config.url));

    // Don't auto-connect - let user decide when to start
    addLog(
      `Loaded ${configs.length} search configurations. Click "Start All Searches" to begin monitoring.`
    );

    // Ensure no auto-connection happens by explicitly disconnecting any existing connections
    console.log("🔧 Calling disconnectAll to clear any existing connections");
    disconnectAll();

    // IMPORTANT: Do NOT call connectAll here - let user decide when to start
  }, []); // Empty dependency array to only run once on mount

  // Rate limiting state
  const [rateLimitQueue, setRateLimitQueue] = useState<
    Array<{
      items: string[];
      searchUrl: string;
      searchLabel: string;
    }>
  >([]);
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);

  // Process rate-limited queue
  const processQueue = useCallback(async () => {
    if (isProcessingQueue || rateLimitQueue.length === 0) return;

    console.log(`🔧 Processing queue with ${rateLimitQueue.length} batches`);
    setIsProcessingQueue(true);
    const currentBatch = rateLimitQueue[0];
    setRateLimitQueue((prev) => prev.slice(1));

    try {
      const isPoe2 = currentBatch.searchUrl.includes("poe2");
      addLog(
        `Fetching item details for ${currentBatch.items.length} items from ${currentBatch.searchLabel}`
      );

      console.log(`🔧 Fetching details for items:`, currentBatch.items);
      const details = await fetchItemDetails({
        itemIds: currentBatch.items,
        searchUrl: currentBatch.searchUrl,
        isPoe2,
      });

      console.log(`🔧 Fetched ${details.length} item details:`, details);
      addLog(
        `Fetched item details for ${details.length} items from ${currentBatch.searchLabel}`
      );

      const newItems = details.map((detail) => ({
        pingedAt: new Date().toISOString(),
        searchLabel: currentBatch.searchLabel,
        ...detail,
      }));

      setItemDetails((prev) => [...newItems, ...prev]);

      // Auto-whisper logic
      if (autoWhisper && newItems.length > 0) {
        const now = Date.now();
        const timeSinceLastWhisper = now - lastWhisperTime;

        if (timeSinceLastWhisper >= 40000) {
          // 40 seconds have passed, send whisper for the first item
          const firstItem = newItems[0];
          if (firstItem.listing?.hideout_token) {
            console.log("🔧 Auto-whispering for item:", firstItem);
            addLog(`Auto-whispering for item from ${currentBatch.searchLabel}`);

            // Import sendWhisper dynamically to avoid circular imports
            import("../../api/sendWhisper").then(({ sendWhisper }) => {
              sendWhisper({
                itemId: firstItem.id,
                hideoutToken: firstItem.listing?.hideout_token,
                searchQueryId: "",
              })
                .then(() => {
                  setLastWhisperTime(now);
                  addLog("Auto-whisper sent successfully");

                  // Send notification for successful whisper
                  sendNotification(
                    "Porting to Hideout",
                    `Auto-whisper sent for ${firstItem.item.name} from ${currentBatch.searchLabel}`
                  );
                })
                .catch((error: Error) => {
                  addLog(`Auto-whisper failed: ${error.message}`);

                  // Send notification for failed whisper
                  sendNotification(
                    "Porting to Hideout Failed",
                    `Failed to send whisper for ${firstItem.item.name}: ${error.message}`
                  );
                });
            });
          }
        } else {
          const remainingCooldown = Math.ceil(
            (40000 - timeSinceLastWhisper) / 1000
          );
          addLog(
            `Auto-whisper blocked - ${remainingCooldown}s cooldown remaining`
          );

          // Send notification for items found during cooldown
          sendNotification(
            "Items Found (Porting to Hideout on Cooldown)",
            `${newItems.length} items found from ${currentBatch.searchLabel} but whisper is on cooldown (${remainingCooldown}s remaining)`
          );
        }
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.startsWith("RATE_LIMIT_EXCEEDED")
      ) {
        const waitTime = error.message.split(":")[1];
        const rateMessage = `⚠️ Rate limit exceeded! Need to wait ${waitTime} seconds before trying again.`;
        addLog(rateMessage);
        toast.error(rateMessage);

        // Re-queue the batch after delay
        setTimeout(() => {
          setRateLimitQueue((prev) => [currentBatch, ...prev]);
        }, parseInt(waitTime) * 1000);
      } else {
        console.error("Failed to fetch item details:", error);
        const fetchErrorMessage = `Error fetching item details: ${
          error instanceof Error ? error.message : String(error)
        }`;
        addLog(fetchErrorMessage);
        toast.error(fetchErrorMessage);
      }
    } finally {
      setIsProcessingQueue(false);
    }
  }, [isProcessingQueue, rateLimitQueue]); // Remove addLog to prevent infinite loop

  // Process queue when it changes
  useEffect(() => {
    if (rateLimitQueue.length > 0 && !isProcessingQueue) {
      // Add delay between requests to respect rate limits
      const delay = 1000; // 1 second delay between requests
      setTimeout(processQueue, delay);
    }
  }, [rateLimitQueue, isProcessingQueue, processQueue]);

  // Function to fetch item details when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      // Process only new messages that haven't been processed yet
      const newMessages = messages.filter((message) => {
        const messageId = `${message.searchId}-${message.time}`;
        return !processedMessageIds.has(messageId);
      });

      newMessages.forEach((message) => {
        if (message.items && message.items.length > 0) {
          const messageId = `${message.searchId}-${message.time}`;
          setProcessedMessageIds((prev) => new Set([...prev, messageId]));

          addLog(
            `New items found: ${message.items.length} items from ${message.searchLabel}`
          );

          // Find the search config that matches the search ID
          const searchConfig = activeSearchConfigs.find(
            (config) => config.id === message.searchId
          );
          const searchUrl = searchConfig?.url || "";
          const searchLabel = message.searchLabel;

          // Add to rate limit queue
          setRateLimitQueue((prev) => [
            ...prev,
            {
              items: message.items,
              searchUrl,
              searchLabel,
            },
          ]);
        }
      });
    }
  }, [messages, activeSearchConfigs, addLog, processedMessageIds]);

  // Whisper cooldown timer
  useEffect(() => {
    if (lastWhisperTime > 0) {
      const interval = setInterval(() => {
        const now = Date.now();
        const timeSinceLastWhisper = now - lastWhisperTime;
        const remainingCooldown = Math.max(0, 40000 - timeSinceLastWhisper);

        setWhisperCooldown(remainingCooldown);

        if (remainingCooldown === 0) {
          setLastWhisperTime(0);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [lastWhisperTime]);

  const clearListings = () => {
    setItemDetails([]);
    clearMessages();
    setProcessedMessageIds(new Set());
    toast.success("Listings cleared");
  };

  // Auto-whisper toggle function
  const toggleAutoWhisper = () => {
    const newValue = !autoWhisper;
    setAutoWhisper(newValue);
    localStorage.setItem("poe-auto-whisper", JSON.stringify(newValue));
    addLog(`Auto-whisper ${newValue ? "enabled" : "disabled"}`);
  };

  // Clear whisper cooldown
  const clearWhisperCooldown = () => {
    setLastWhisperTime(0);
    setWhisperCooldown(0);
    addLog("Whisper cooldown cleared");
  };

  // Connect to all active searches
  const connect = useCallback(() => {
    console.log(
      "🔌 Connect function called - this should only happen when user clicks Start Monitoring"
    );
    console.trace("🔍 Stack trace for connect call:");
    const configs = getActiveSearchConfigs();
    console.log("📋 Active configs found:", configs);
    setActiveSearchConfigs(configs);
    setSearchUrls(configs.map((config) => config.url));
    connectAll(configs);
    addLog(`Connecting to ${configs.length} active searches...`);
  }, [connectAll]); // Remove addLog to prevent infinite loop

  // Disconnect from all searches
  const disconnect = useCallback(() => {
    disconnectAll();
    addLog("Disconnected from all searches");
  }, [disconnectAll]); // Remove addLog to prevent infinite loop

  // Function to update current search URL (for backward compatibility)
  const updateCurrentSearchUrl = useCallback(
    (url: string) => {
      // This is now handled by the multi-connection system
      addLog(`Search URL updated: ${url}`);
    },
    [] // Remove addLog to prevent infinite loop
  );

  // Get overall connection status
  const isConnected = hasActiveConnections;
  const error =
    Array.from(connectionStatuses.values()).find((status) => status.error)
      ?.error || null;

  return {
    searchUrls,
    setSearchUrls,
    isConnected,
    connect,
    disconnect,
    error,
    logs,
    itemDetails,
    isLoading: isLoading || isProcessingQueue,
    clearListings,
    activeSearchConfigs,
    updateCurrentSearchUrl,
    connectionStatuses,
    hasActiveConnections,
    totalConnections,
    autoWhisper,
    toggleAutoWhisper,
    whisperCooldown,
    clearWhisperCooldown,
  };
};
