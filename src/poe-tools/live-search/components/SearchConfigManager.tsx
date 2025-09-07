import React, { useState } from "react";
import Button from "src/components/Button";
import Input from "src/components/Input";
import { SearchConfig } from "../utils/types";
import {
  addSearchConfig,
  updateSearchConfig,
  deleteSearchConfig,
  getSearchConfigs,
} from "../utils/searchConfigManager";
import { toast } from "react-hot-toast";
import clsx from "clsx";

interface SearchConfigManagerProps {
  onConfigsChange: () => void;
}

const SearchConfigManager: React.FC<SearchConfigManagerProps> = ({
  onConfigsChange,
}) => {
  const [configs, setConfigs] = useState<SearchConfig[]>(getSearchConfigs());
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newConfig, setNewConfig] = useState({ label: "", url: "" });

  const handleAddConfig = () => {
    if (!newConfig.label.trim() || !newConfig.url.trim()) {
      toast.error("Please provide both label and URL");
      return;
    }

    try {
      addSearchConfig({
        label: newConfig.label.trim(),
        url: newConfig.url.trim(),
        isActive: true,
      });
      setConfigs(getSearchConfigs());
      setNewConfig({ label: "", url: "" });
      setIsAddingNew(false);
      onConfigsChange();
      toast.success("Search configuration added");
    } catch (error) {
      toast.error("Failed to add search configuration");
    }
  };

  const handleToggleActive = (id: string, isActive: boolean) => {
    updateSearchConfig(id, { isActive });
    setConfigs(getSearchConfigs());
    onConfigsChange();
    toast.success(`Search ${isActive ? "activated" : "deactivated"}`);

    // Auto-refresh the page to reconnect with new configs
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleDelete = (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this search configuration?"
      )
    ) {
      deleteSearchConfig(id);
      setConfigs(getSearchConfigs());
      onConfigsChange();
      toast.success("Search configuration deleted");

      // Auto-refresh the page to reconnect with new configs
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const handleEdit = (id: string, field: "label" | "url", value: string) => {
    updateSearchConfig(id, { [field]: value });
    setConfigs(getSearchConfigs());
    onConfigsChange();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-200">
          Search Configurations
        </h3>
        <Button
          size="small"
          onClick={() => setIsAddingNew(true)}
          disabled={isAddingNew}
        >
          Add Search
        </Button>
      </div>

      {isAddingNew && (
        <div className="border border-gray-700 rounded-md p-4 bg-gray-900">
          <h4 className="text-md font-medium text-gray-200 mb-3">
            Add New Search
          </h4>
          <div className="space-y-3">
            <Input
              label="Label:"
              value={newConfig.label}
              onChange={(value) =>
                setNewConfig((prev) => ({ ...prev, label: String(value) }))
              }
              placeholder="e.g., High DPS Bows"
            />
            <Input
              label="Search URL:"
              value={newConfig.url}
              onChange={(value) =>
                setNewConfig((prev) => ({ ...prev, url: String(value) }))
              }
              placeholder="https://www.pathofexile.com/trade/search/..."
            />
            <div className="flex gap-2">
              <Button size="small" onClick={handleAddConfig}>
                Add
              </Button>
              <Button
                size="small"
                variant="outline"
                onClick={() => {
                  setIsAddingNew(false);
                  setNewConfig({ label: "", url: "" });
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {configs.length === 0 ? (
          <p className="text-gray-400 text-sm">
            No search configurations yet. Add one to get started!
          </p>
        ) : (
          configs.map((config) => (
            <div
              key={config.id}
              className={clsx(
                "border rounded-md p-3 transition-colors",
                config.isActive
                  ? "border-green-600 bg-green-900/20"
                  : "border-gray-700 bg-gray-900"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={config.isActive}
                      onChange={(e) =>
                        handleToggleActive(config.id, e.target.checked)
                      }
                      className="rounded"
                    />
                    <span
                      className={clsx(
                        "text-sm font-medium",
                        config.isActive ? "text-green-400" : "text-gray-400"
                      )}
                    >
                      {config.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <Input
                      label="Label:"
                      value={config.label}
                      onChange={(value) =>
                        handleEdit(config.id, "label", String(value))
                      }
                    />
                    <Input
                      label="URL:"
                      value={config.url}
                      onChange={(value) =>
                        handleEdit(config.id, "url", String(value))
                      }
                    />
                  </div>
                </div>

                <div className="ml-4 flex flex-col gap-1">
                  <Button
                    size="small"
                    variant="danger"
                    onClick={() => handleDelete(config.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchConfigManager;
