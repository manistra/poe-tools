import React, { useState } from "react";

import Button from "src/renderer/components/Button";
import Input from "src/renderer/components/Input";
import { toast } from "react-hot-toast";

import LiveSearchItem from "./LiveSearchItem";
import { useLiveSearchContext } from "./context/hooks/useLiveSearchContext";

const LiveSearchesList: React.FC = () => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newConfig, setNewConfig] = useState({ label: "", url: "" });
  const { liveSearches, addLiveSearch } = useLiveSearchContext();

  const handleAddConfig = () => {
    if (!newConfig.label.trim() || !newConfig.url.trim()) {
      toast.error("Please provide both label and URL");
      return;
    }

    try {
      //Add to live searches
      addLiveSearch({
        label: newConfig.label,
        url: newConfig.url,
        isActive: true,
      });

      setNewConfig({ label: "", url: "" });
      setIsAddingNew(false);

      toast.success("Live Search added");
    } catch (error) {
      toast.error("Failed to add Live Search");
    }
  };

  return (
    <div className="w-full space-y-1">
      {/* Add New Search Button */}
      <div className="flex justify-end mb-2">
        <Button
          size="small"
          variant="outline"
          onClick={() => setIsAddingNew(true)}
          disabled={isAddingNew}
          className="text-xs px-3 py-1"
        >
          + Add New Search
        </Button>
      </div>

      {/* Add New Search Form */}
      {isAddingNew && (
        <div className="border border-gray-700 rounded-md p-3 bg-black mb-2">
          <div className="space-y-2">
            <Input
              label="Search Label:"
              value={newConfig.label}
              onChange={(value) =>
                setNewConfig((prev) => ({ ...prev, label: String(value) }))
              }
              placeholder="e.g., High DPS Bows"
              className="text-xs"
            />
            <Input
              label="URL:"
              value={newConfig.url}
              onChange={(value) =>
                setNewConfig((prev) => ({ ...prev, url: String(value) }))
              }
              placeholder="https://www.pathofexile.com/trade/search/..."
              className="text-xs"
            />
            <div className="flex flex-row w-full justify-end gap-2">
              <Button
                size="small"
                variant="outline"
                onClick={() => {
                  setIsAddingNew(false);
                  setNewConfig({ label: "", url: "" });
                }}
                className="text-xs px-2 py-1"
              >
                Cancel
              </Button>

              <Button
                size="small"
                variant="success"
                onClick={handleAddConfig}
                className="text-xs px-2 py-1"
              >
                Add New Search
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Existing Search Items */}
      {liveSearches.map((liveSearch) => {
        return <LiveSearchItem key={liveSearch.id} liveSearch={liveSearch} />;
      })}
    </div>
  );
};

export default LiveSearchesList;
