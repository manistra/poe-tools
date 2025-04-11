import React, { useState, useEffect } from "react";
import ModalBase from "src/components/Modal";
import Button from "src/components/Button";
import { TransformedItemData } from "../query-weapons-with-amazon-accuracy/utils/calcs/types";
import Items from "./Items";

interface SavedItemsModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const SavedItemsModal: React.FC<SavedItemsModalProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const [savedItems, setSavedItems] = useState<TransformedItemData[]>([]);

  useEffect(() => {
    const loadSavedItems = () => {
      const savedItemsJson = window.localStorage.getItem("savedItems");
      if (savedItemsJson) {
        try {
          const items = JSON.parse(savedItemsJson);
          setSavedItems(items);
        } catch (error) {
          console.error("Failed to parse saved items:", error);
        }
      }
    };

    if (isOpen) {
      loadSavedItems();
    }
  }, [isOpen]);

  const handleClearSavedItems = () => {
    if (window.confirm("Are you sure you want to clear all saved items?")) {
      window.localStorage.removeItem("savedItems");
      setSavedItems([]);
    }
  };

  return (
    <ModalBase
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      className="card max-w-[1000px] w-full max-h-[80vh] overflow-y-auto"
    >
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Saved Items</h2>
          <div className="flex gap-2">
            <Button
              size="small"
              variant="danger"
              onClick={handleClearSavedItems}
              disabled={savedItems.length === 0}
            >
              Clear All
            </Button>
            <Button
              size="small"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>

        {savedItems.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No saved items found
          </div>
        ) : (
          <Items
            items={savedItems}
            calculateForAmazonAscendancy={true}
            showSaveButton={false}
          />
        )}
      </div>
    </ModalBase>
  );
};

export default SavedItemsModal;
