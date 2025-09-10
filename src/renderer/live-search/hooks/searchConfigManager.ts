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

// Migration function to move data from old localStorage to shared store
export const migrateSearchConfigs = (): void => {
  try {
    const oldConfigs = localStorage.getItem("poe-search-configs");
    if (oldConfigs) {
      const configs = JSON.parse(oldConfigs);
      if (Array.isArray(configs) && configs.length > 0) {
        persistentStore.setSearchConfigs(configs);
        // Remove old data after successful migration
        localStorage.removeItem("poe-search-configs");
        console.log("Successfully migrated search configs to shared store");
      }
    }
  } catch (error) {
    console.error("Error migrating search configs:", error);
  }
};
