import { useState, useEffect, useCallback } from "react";
import { AppState, Log } from "./storeUtils";
import { LiveSearch, TransformedItemData } from "../types";
import { persistentStore } from "../store/sharedStore";

// Main hook to access the entire store
export const useAppStore = () => {
  const [state, setState] = useState<AppState>(persistentStore.getState());

  useEffect(() => {
    const unsubscribe = persistentStore.subscribe(setState);
    return unsubscribe;
  }, []);

  return {
    state,
    setState: persistentStore.setState.bind(persistentStore),
    setPoeSessionId: persistentStore.setPoeSessionId.bind(persistentStore),
    setWebSocketSessionId:
      persistentStore.setWebSocketSessionId.bind(persistentStore),
    setLastTeleportedItem:
      persistentStore.setLastTeleportedItem.bind(persistentStore),
    setRateLimitData: persistentStore.setRateLimitData.bind(persistentStore),
    setLiveSearches: persistentStore.setLiveSearches.bind(persistentStore),
    addLiveSearch: persistentStore.addLiveSearch.bind(persistentStore),
    updateLiveSearch: persistentStore.updateLiveSearch.bind(persistentStore),
    deleteLiveSearch: persistentStore.deleteLiveSearch.bind(persistentStore),
    setResults: persistentStore.setResults.bind(persistentStore),
    addResult: persistentStore.addResult.bind(persistentStore),
    clearResults: persistentStore.clearResults.bind(persistentStore),
    setAutoWhisper: persistentStore.setAutoWhisper.bind(persistentStore),
    addLog: persistentStore.addLog.bind(persistentStore),
    setLogs: persistentStore.setLogs.bind(persistentStore),
    clearLogs: persistentStore.clearLogs.bind(persistentStore),
    reset: persistentStore.reset.bind(persistentStore),
  };
};

// Individual hooks for specific state slices
export const usePoeSessionId = () => {
  const [sessionId, setSessionId] = useState<string>(
    persistentStore.getState().poeSessionid
  );

  useEffect(() => {
    const unsubscribe = persistentStore.subscribe((state) => {
      setSessionId(state.poeSessionid);
    });
    return unsubscribe;
  }, []);

  const updateSessionId = useCallback((newSessionId: string) => {
    persistentStore.setPoeSessionId(newSessionId);
  }, []);

  return [sessionId, updateSessionId] as const;
};

export const useWebSocketSessionId = () => {
  const [webSocketSessionId, setWebSocketSessionId] = useState<string>(
    persistentStore.getState().webSocketSessionId
  );

  useEffect(() => {
    const unsubscribe = persistentStore.subscribe((state) => {
      setWebSocketSessionId(state.webSocketSessionId);
    });
    return unsubscribe;
  }, []);

  const updateWebSocketSessionId = useCallback((newSessionId: string) => {
    persistentStore.setWebSocketSessionId(newSessionId);
  }, []);

  return [webSocketSessionId, updateWebSocketSessionId] as const;
};

export const useLastTeleportedItem = () => {
  const [lastTeleportedItem, setLastTeleportedItem] = useState<
    (TransformedItemData & { alreadyTeleported?: boolean }) | undefined
  >(persistentStore.getState().lastTeleportedItem);

  useEffect(() => {
    const unsubscribe = persistentStore.subscribe((state) => {
      setLastTeleportedItem(state.lastTeleportedItem);
    });
    return unsubscribe;
  }, []);

  const updateLastTeleportedItem = useCallback(
    (
      item: (TransformedItemData & { alreadyTeleported?: boolean }) | undefined
    ) => {
      persistentStore.setLastTeleportedItem(item);
    },
    []
  );

  return [lastTeleportedItem, updateLastTeleportedItem] as const;
};

export const useRateLimitData = () => {
  const [rateLimitData, setRateLimitData] = useState<{
    requestLimit: number;
    interval: number;
  }>(persistentStore.getState().rateLimitData);

  useEffect(() => {
    const unsubscribe = persistentStore.subscribe((state) => {
      setRateLimitData(state.rateLimitData);
    });
    return unsubscribe;
  }, []);

  const updateRateLimitData = useCallback(
    (data: { requestLimit: number; interval: number }) => {
      persistentStore.setRateLimitData(data);
    },
    []
  );

  return [rateLimitData, updateRateLimitData] as const;
};

export const useLiveSearches = () => {
  const [liveSearches, setLiveSearches] = useState<LiveSearch[]>(
    persistentStore.getState().liveSearches
  );

  useEffect(() => {
    const unsubscribe = persistentStore.subscribe((state) => {
      console.log("useLiveSearches: State updated:", state.liveSearches);
      setLiveSearches(state.liveSearches);
    });
    return unsubscribe;
  }, []);

  const addLiveSearch = useCallback((liveSearch: LiveSearch) => {
    return persistentStore.addLiveSearch(liveSearch);
  }, []);

  const updateLiveSearch = useCallback(
    (id: string, updates: Partial<Omit<LiveSearch, "id">>) => {
      persistentStore.updateLiveSearch(id, updates);
    },
    []
  );

  const deleteLiveSearch = useCallback((id: string) => {
    persistentStore.deleteLiveSearch(id);
  }, []);

  return {
    liveSearches,
    addLiveSearch,
    updateLiveSearch,
    deleteLiveSearch,
    setLiveSearches,
  };
};

export const useResults = () => {
  const [results, setResults] = useState<TransformedItemData[]>(
    persistentStore.getState().results
  );

  useEffect(() => {
    const unsubscribe = persistentStore.subscribe((state) => {
      setResults(state.results);
    });
    return unsubscribe;
  }, []);

  const addResult = useCallback((result: TransformedItemData) => {
    persistentStore.addResult(result);
  }, []);

  const clearResults = useCallback(() => {
    persistentStore.clearResults();
  }, []);

  return {
    results,
    addResult,
    clearResults,
  };
};

export const useAutoWhisper = () => {
  const [autoWhisper, setAutoWhisper] = useState<boolean>(
    persistentStore.getState().autoWhisper
  );

  useEffect(() => {
    const unsubscribe = persistentStore.subscribe((state) => {
      setAutoWhisper(state.autoWhisper);
    });
    return unsubscribe;
  }, []);

  const updateAutoWhisper = useCallback((enabled: boolean) => {
    persistentStore.setAutoWhisper(enabled);
  }, []);

  return [autoWhisper, updateAutoWhisper] as const;
};

export const useRateLimiterTokens = () => {
  const [tokens, setTokens] = useState<number>(
    persistentStore.getState().rateLimiterTokens
  );

  useEffect(() => {
    const unsubscribe = persistentStore.subscribe((state) => {
      setTokens(state.rateLimiterTokens);
    });
    return unsubscribe;
  }, []);

  // Add periodic refresh every 0.5 seconds
  useEffect(() => {
    const refreshTokens = async () => {
      try {
        const { electronAPI } = await import("../../renderer/api/electronAPI");
        const currentTokens = await electronAPI.rateLimiter.getCurrentTokens();
        persistentStore.setRateLimiterTokens(currentTokens);
      } catch (error) {
        console.error("Failed to refresh rate limiter tokens:", error);
      }
    };

    // Initial refresh
    refreshTokens();

    // Set up interval for periodic refresh
    const interval = setInterval(refreshTokens, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const updateTokens = useCallback((newTokens: number) => {
    persistentStore.setRateLimiterTokens(newTokens);
  }, []);

  return [tokens, updateTokens] as const;
};

export const useLogs = () => {
  const [logs, setLogsState] = useState<Log[]>(persistentStore.getState().logs);

  useEffect(() => {
    const unsubscribe = persistentStore.subscribe((state) => {
      setLogsState(state.logs);
    });
    return unsubscribe;
  }, []);

  const addLog = useCallback((message: string) => {
    persistentStore.addLog(message);
  }, []);

  const setLogs = useCallback((newLogs: Log[]) => {
    persistentStore.setLogs(newLogs);
  }, []);

  const clearLogs = useCallback(() => {
    persistentStore.clearLogs();
  }, []);

  return {
    logs,
    addLog,
    setLogs,
    clearLogs,
  };
};

// Hook for synchronous access to current state (useful for event handlers)
export const useAppStoreSync = () => {
  return {
    getState: persistentStore.getState.bind(persistentStore),
    setPoeSessionId: persistentStore.setPoeSessionId.bind(persistentStore),
    setWebSocketSessionId:
      persistentStore.setWebSocketSessionId.bind(persistentStore),
    setLastTeleportedItem:
      persistentStore.setLastTeleportedItem.bind(persistentStore),
    setRateLimitData: persistentStore.setRateLimitData.bind(persistentStore),
    setLiveSearches: persistentStore.setLiveSearches.bind(persistentStore),
    addLiveSearch: persistentStore.addLiveSearch.bind(persistentStore),
    updateLiveSearch: persistentStore.updateLiveSearch.bind(persistentStore),
    deleteLiveSearch: persistentStore.deleteLiveSearch.bind(persistentStore),
    setResults: persistentStore.setResults.bind(persistentStore),
    addResult: persistentStore.addResult.bind(persistentStore),
    clearResults: persistentStore.clearResults.bind(persistentStore),
    setAutoWhisper: persistentStore.setAutoWhisper.bind(persistentStore),
    addLog: persistentStore.addLog.bind(persistentStore),
    setLogs: persistentStore.setLogs.bind(persistentStore),
    clearLogs: persistentStore.clearLogs.bind(persistentStore),
    reset: persistentStore.reset.bind(persistentStore),
  };
};
