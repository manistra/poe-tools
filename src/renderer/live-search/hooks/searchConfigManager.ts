import { SearchConfig } from "src/shared/types";
import { persistentStore } from "src/shared/sharedStore";

// New search config manager using shared store
export const getSearchConfigs = (): SearchConfig[] => {
  return persistentStore.getState().searchConfigs;
};

export const saveSearchConfigs = (configs: SearchConfig[]): void => {
  persistentStore.setSearchConfigs(configs);
};

export const addSearchConfig = (
  config: Omit<SearchConfig, "id">
): SearchConfig => {
  return persistentStore.addSearchConfig(config);
};

export const updateSearchConfig = (
  id: string,
  updates: Partial<Omit<SearchConfig, "id">>
): void => {
  persistentStore.updateSearchConfig(id, updates);
};

export const deleteSearchConfig = (id: string): void => {
  persistentStore.deleteSearchConfig(id);
};

export const getActiveSearchConfigs = (): SearchConfig[] => {
  return getSearchConfigs().filter((config) => config.isActive);
};

export const deleteAllSearchConfigs = (): void => {
  persistentStore.setSearchConfigs([]);
};
