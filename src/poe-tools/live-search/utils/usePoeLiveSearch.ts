import { useState, useEffect, useCallback } from "react";

import { fetchItemDetails } from "src/poe-tools/api/fetchItemDetails";

import useLogs from "src/helpers/useLogs";
import { ItemData, SearchConfig } from "./types";
import { toast } from "react-hot-toast";
import { useWebSocketConnection } from "../ConnectionContext/WebSocketConnectionProvider";
import { getSearchConfigs } from "./searchConfigManager";
import { sendNotification } from "../../utils/useNotification";
import { sendWhisper } from "../../api/sendWhisper";
import { mockData } from "../../../mockData";

interface UsePoeLiveSearchReturn {
  searchUrls: string[];
  setSearchUrls: (urls: string[]) => void;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  connectIndividual: (config: SearchConfig) => void;
  disconnectIndividual: (searchId: string) => void;
  error: string | null;
  logs: string[];
  itemDetails: ItemData[];
  isLoading: boolean;
  clearListings: () => void;
  allSearchConfigs: SearchConfig[];
  updateCurrentSearchUrl: (url: string) => void;
  connectionStatuses: Map<
    string,
    { isConnected: boolean; isLoading: boolean; error: string | null }
  >;
  hasActiveConnections: boolean;
  totalConnections: number;
  autoWhisper: boolean;
  toggleAutoWhisper: () => void;
  lastWhisperItem: ItemData | undefined;
  shouldShowCooldownModal: boolean;
  isWhisperBlocked: boolean;
  clearWhisperBlock: () => void;
}

export const usePoeLiveSearch = (): UsePoeLiveSearchReturn => {
  const [itemDetails, setItemDetails] = useState<ItemData[]>([]);
  const [isLoading] = useState(false);
  const [allSearchConfigs, setAllSearchConfigs] = useState<SearchConfig[]>([]);
  const [searchUrls, setSearchUrls] = useState<string[]>([]);
  const [processedMessageIds, setProcessedMessageIds] = useState<Set<string>>(
    new Set()
  );
  const [autoWhisper, setAutoWhisper] = useState<boolean>(() => {
    const stored = localStorage.getItem("poe-auto-whisper");
    return stored ? JSON.parse(stored) : false;
  });
  const [lastWhisperItem, setLastWhisperItem] = useState<ItemData | undefined>(
    undefined
  );
  const [shouldShowCooldownModal, setShouldShowCooldownModal] =
    useState<boolean>(false);
  const [isWhisperBlocked, setIsWhisperBlocked] = useState<boolean>(false);

  const {
    messages,
    connectionStatuses,
    hasActiveConnections,
    totalConnections,
    connectAll,
    disconnectAll,
    connectIndividual,
    disconnectIndividual,
    clearMessages,
  } = useWebSocketConnection();

  const { logs, addLog } = useLogs();

  // Load all search configs on mount (but don't auto-connect)
  useEffect(() => {
    console.log("🔧 usePoeLiveSearch useEffect called - loading configs");
    const configs = getSearchConfigs();
    console.log("🔧 Loaded configs:", configs);
    setAllSearchConfigs(configs);
    const activeConfigs = configs.filter((config) => config.isActive);
    setSearchUrls(activeConfigs.map((config) => config.url));

    // Add mock item for development
    setItemDetails(mockData as unknown as ItemData[]);

    // Don't auto-connect - let user decide when to start
    addLog(
      `Loaded ${configs.length} search configurations (${activeConfigs.length} active). Click "Start All Searches" to begin monitoring.`
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

  // Add this new function for immediate whisper
  const sendImmediateWhisper = useCallback(
    async (item: ItemData) => {
      if (!item.listing?.hideout_token) {
        addLog(`No hideout token for item ${item.id}`);
        return;
      }

      try {
        console.log("🚀 IMMEDIATE WHISPER - Sending whisper for item:", item);
        addLog(`Immediate auto-whisper for ${item.item.name}`);

        const response = await sendWhisper({
          itemId: item.id,
          hideoutToken: item.listing.hideout_token,
          searchQueryId: "",
        });

        setLastWhisperItem(item);
        setShouldShowCooldownModal(true);
        setIsWhisperBlocked(true);
        addLog("Immediate auto-whisper sent successfully");

        sendNotification(
          "Porting to Hideout",
          `Auto-whisper sent for ${item.item.name}`
        );

        return response;
      } catch (error: any) {
        addLog(`Immediate auto-whisper failed: ${error.message}`);
        sendNotification(
          "Porting to Hideout Failed",
          `Failed to send whisper for ${item.item.name}: ${error.message}`
        );
        throw error;
      }
    },
    [addLog]
  );

  // Modify the processQueue function to trigger immediate whisper
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

      // IMMEDIATE AUTO-WHISPER - Trigger as soon as we have item details
      if (autoWhisper && newItems.length > 0 && !isWhisperBlocked) {
        const firstItem = newItems[0];
        if (firstItem.listing?.hideout_token) {
          // Send whisper immediately with the actual item data
          sendImmediateWhisper(firstItem);
        } else {
          addLog(`First item ${firstItem.id} has no hideout token`);
        }
      } else if (autoWhisper && newItems.length > 0 && isWhisperBlocked) {
        addLog(
          `Auto-whisper blocked - modal is open, please close it to continue`
        );

        sendNotification(
          "Items Found (Whisper Blocked)",
          `${newItems.length} items found from ${currentBatch.searchLabel} but whisper is blocked by open modal`
        );
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
  }, [
    isProcessingQueue,
    rateLimitQueue,
    autoWhisper,
    isWhisperBlocked,
    sendImmediateWhisper,
    addLog,
  ]);

  // Process queue when it changes
  useEffect(() => {
    if (rateLimitQueue.length > 0 && !isProcessingQueue) {
      // Remove the delay completely - process immediately
      processQueue();
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
          const searchConfig = allSearchConfigs.find(
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
  }, [messages, allSearchConfigs, addLog, processedMessageIds]);

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

  // Clear whisper block
  const clearWhisperBlock = () => {
    setIsWhisperBlocked(false);
    setShouldShowCooldownModal(false);
    addLog("Whisper block cleared - auto-whisper re-enabled");
  };

  // Connect to all active searches
  const connect = useCallback(() => {
    console.log(
      "🔌 Connect function called - this should only happen when user clicks Start Sniping"
    );
    console.trace("🔍 Stack trace for connect call:");
    const configs = getSearchConfigs();
    const activeConfigs = configs.filter((config) => config.isActive);
    console.log("📋 Active configs found:", activeConfigs);
    setAllSearchConfigs(configs);
    setSearchUrls(activeConfigs.map((config) => config.url));
    connectAll(activeConfigs);
    addLog(`Connecting to ${activeConfigs.length} active searches...`);
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
    connectIndividual,
    disconnectIndividual,
    error,
    logs,
    itemDetails,
    isLoading: isLoading || isProcessingQueue,
    clearListings,
    allSearchConfigs,
    updateCurrentSearchUrl,
    connectionStatuses,
    hasActiveConnections,
    totalConnections,
    autoWhisper,
    toggleAutoWhisper,
    lastWhisperItem,
    shouldShowCooldownModal,
    isWhisperBlocked,
    clearWhisperBlock,
  };
};
