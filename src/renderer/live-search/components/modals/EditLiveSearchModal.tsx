import React, { useState, useEffect } from "react";
import ModalBase from "src/renderer/components/Modal";
import Input from "src/renderer/components/Input";
import Button from "src/renderer/components/Button";
import { LiveSearch } from "src/shared/types";
import { useLiveSearchContext } from "../../context/hooks/useLiveSearchContext";
import { toast } from "react-hot-toast";

interface EditLiveSearchModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  liveSearch: LiveSearch | null;
}

const EditLiveSearchModal: React.FC<EditLiveSearchModalProps> = ({
  isOpen,
  setIsOpen,
  liveSearch,
}) => {
  const [editLabel, setEditLabel] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const { updateLiveSearch } = useLiveSearchContext();

  // Load the live search data into local state when modal opens
  useEffect(() => {
    if (isOpen && liveSearch) {
      setEditLabel(liveSearch.label);
      setEditUrl(liveSearch.url);
    }
  }, [isOpen, liveSearch]);

  const handleSave = () => {
    if (!editLabel.trim() || !editUrl.trim()) {
      toast.error("Please provide both label and URL");
      return;
    }

    if (!liveSearch) {
      toast.error("No live search selected");
      return;
    }

    try {
      updateLiveSearch(liveSearch.id, {
        label: editLabel.trim(),
        url: editUrl.trim(),
      });

      setIsOpen(false);
      toast.success("Search configuration updated");
    } catch (error) {
      toast.error("Failed to update search configuration");
    }
  };

  const handleCancel = () => {
    if (liveSearch) {
      setEditLabel(liveSearch.label);
      setEditUrl(liveSearch.url);
    }
    setIsOpen(false);
  };

  const handleClose = () => {
    handleCancel();
  };

  return (
    <ModalBase
      onClose={handleClose}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      className="card max-w-md w-full"
    >
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold mb-2">Edit Live Search</h3>

        <div className="space-y-4">
          <Input
            label="Live Search Label:"
            value={editLabel}
            onChange={(value) => setEditLabel(String(value))}
            placeholder="Enter search label"
          />
          <Input
            label="URL:"
            value={editUrl}
            onChange={(value) => setEditUrl(String(value))}
            placeholder="Enter search URL"
          />
        </div>

        <div className="flex gap-2 justify-end mt-4">
          <Button size="small" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button size="small" variant="success" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </ModalBase>
  );
};

export default EditLiveSearchModal;
