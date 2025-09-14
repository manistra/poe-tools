import React, { useState } from "react";
import toast from "react-hot-toast";
import Button from "src/renderer/components/Button";
import Input from "src/renderer/components/Input";
import { useLiveSearchContext } from "src/renderer/live-search/context/hooks/useLiveSearchContext";

const NewLiveSearchForm: React.FC<{
  open: boolean;
  setIsOpen: (isAddingNew: boolean) => void;
}> = ({ open, setIsOpen }) => {
  const [newConfig, setNewConfig] = useState({ label: "", url: "" });

  const { addLiveSearch } = useLiveSearchContext();

  const handleAddConfig = async () => {
    if (!newConfig.label.trim() || !newConfig.url.trim()) {
      toast.error("Please provide both label and URL");
      return;
    }

    try {
      //Add to live searches
      addLiveSearch({
        label: newConfig.label,
        url: newConfig.url,
      });

      setNewConfig({ label: "", url: "" });
      setIsOpen(false);

      toast.success("Live Search added");
    } catch (error) {
      toast.error("Failed to add Live Search");
    }
  };

  if (!open) return null;

  return (
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
          onChange={(value) => {
            const urlValue = String(value);
            const processedUrl = urlValue.endsWith("/live")
              ? urlValue
              : urlValue + (urlValue.endsWith("/") ? "live" : "/live");
            setNewConfig((prev) => ({ ...prev, url: processedUrl }));
          }}
          placeholder="https://www.pathofexile.com/trade/search/..."
          className="text-xs"
        />
        <div className="flex flex-row w-full justify-end gap-2">
          <Button
            size="small"
            variant="outline"
            onClick={() => {
              setIsOpen(false);
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
  );
};

export default NewLiveSearchForm;
