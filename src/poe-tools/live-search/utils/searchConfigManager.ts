import { SearchConfig } from "./types";

const STORAGE_KEY = "poe-search-configs";

export const getSearchConfigs = (): SearchConfig[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Return default empty config
      return [];
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error loading search configs:", error);
    return [];
  }
};

export const saveSearchConfigs = (configs: SearchConfig[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
  } catch (error) {
    console.error("Error saving search configs:", error);
  }
};

export const addSearchConfig = (
  config: Omit<SearchConfig, "id">
): SearchConfig => {
  const configs = getSearchConfigs();
  const newConfig: SearchConfig = {
    ...config,
    id: `search-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };
  const updatedConfigs = [...configs, newConfig];
  saveSearchConfigs(updatedConfigs);
  return newConfig;
};

export const updateSearchConfig = (
  id: string,
  updates: Partial<Omit<SearchConfig, "id">>
): void => {
  const configs = getSearchConfigs();
  const updatedConfigs = configs.map((config) =>
    config.id === id ? { ...config, ...updates } : config
  );
  saveSearchConfigs(updatedConfigs);
};

export const deleteSearchConfig = (id: string): void => {
  const configs = getSearchConfigs();
  const updatedConfigs = configs.filter((config) => config.id !== id);
  saveSearchConfigs(updatedConfigs);
};

export const getActiveSearchConfigs = (): SearchConfig[] => {
  return getSearchConfigs().filter((config) => config.isActive);
};
