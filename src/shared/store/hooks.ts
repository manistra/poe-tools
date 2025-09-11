import { useState, useEffect, useCallback } from "react";
import { AppState } from "./storeUtils";
import { SearchConfig, TransformedItemData } from "../types";
import { persistentStore } from "../store/sharedStore";
import { electronAPI } from "src/renderer/api/electronAPI";

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
    setSearchConfigs: persistentStore.setSearchConfigs.bind(persistentStore),
    addSearchConfig: persistentStore.addSearchConfig.bind(persistentStore),
    updateSearchConfig:
      persistentStore.updateSearchConfig.bind(persistentStore),
    deleteSearchConfig:
      persistentStore.deleteSearchConfig.bind(persistentStore),
    setResults: persistentStore.setResults.bind(persistentStore),
    addResult: persistentStore.addResult.bind(persistentStore),
    clearResults: persistentStore.clearResults.bind(persistentStore),
    setAutoWhisper: persistentStore.setAutoWhisper.bind(persistentStore),
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

export const useSearchConfigs = () => {
  const [configs, setConfigs] = useState<SearchConfig[]>(
    persistentStore.getState().searchConfigs
  );

  useEffect(() => {
    const unsubscribe = persistentStore.subscribe((state) => {
      setConfigs(state.searchConfigs);
    });
    return unsubscribe;
  }, []);

  const addConfig = useCallback((config: Omit<SearchConfig, "id">) => {
    return persistentStore.addSearchConfig(config);
  }, []);

  const updateConfig = useCallback(
    (id: string, updates: Partial<Omit<SearchConfig, "id">>) => {
      persistentStore.updateSearchConfig(id, updates);
    },
    []
  );

  const deleteConfig = useCallback((id: string) => {
    persistentStore.deleteSearchConfig(id);
  }, []);

  return {
    configs,
    addConfig,
    updateConfig,
    deleteConfig,
    setConfigs,
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

// Hook for synchronous access to current state (useful for event handlers)
export const useAppStoreSync = () => {
  return {
    getState: persistentStore.getState.bind(persistentStore),
    setPoeSessionId: persistentStore.setPoeSessionId.bind(persistentStore),
    setSearchConfigs: persistentStore.setSearchConfigs.bind(persistentStore),
    addSearchConfig: persistentStore.addSearchConfig.bind(persistentStore),
    updateSearchConfig:
      persistentStore.updateSearchConfig.bind(persistentStore),
    deleteSearchConfig:
      persistentStore.deleteSearchConfig.bind(persistentStore),
    setResults: persistentStore.setResults.bind(persistentStore),
    addResult: persistentStore.addResult.bind(persistentStore),
    clearResults: persistentStore.clearResults.bind(persistentStore),
    setAutoWhisper: persistentStore.setAutoWhisper.bind(persistentStore),
    reset: persistentStore.reset.bind(persistentStore),
  };
};
