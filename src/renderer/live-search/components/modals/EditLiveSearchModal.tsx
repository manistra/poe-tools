import React, { useState, useEffect } from "react";
import ModalBase from "src/renderer/components/Modal";
import Input from "src/renderer/components/Input";
import Button from "src/renderer/components/Button";
import Dropdown, { DropdownOption } from "src/renderer/components/Dropdown";
import { LiveSearch, Poe2Currency } from "src/shared/types";
import { useLiveSearchContext } from "../../context/hooks/useLiveSearchContext";
import {
  poe2CurrencyValues,
  POE2_CURRENCY_LABELS,
} from "src/renderer/constants/poe2currency";
import { toast } from "react-hot-toast";
import { getCurrencyImage } from "src/renderer/helpers/getCurrencyImage";
import { electronAPI } from "src/renderer/api/electronAPI";

interface EditLiveSearchModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  liveSearch: LiveSearch | null;
}

// Create currency options for dropdown
const currencyOptions: DropdownOption[] = poe2CurrencyValues.map(
  (currency) => ({
    id: currency,
    label: POE2_CURRENCY_LABELS[currency],
    value: currency,
    img: getCurrencyImage(currency),
  })
);

interface CurrencyCondition {
  id: string;
  currency?: Poe2Currency;
  minPrice?: number;
  maxPrice?: number;
}

const EditLiveSearchModal: React.FC<EditLiveSearchModalProps> = ({
  isOpen,
  setIsOpen,
  liveSearch,
}) => {
  const [editLabel, setEditLabel] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [currencyConditions, setCurrencyConditions] = useState<
    CurrencyCondition[]
  >([]);
  const { updateLiveSearch } = useLiveSearchContext();

  // Load the live search data into local state when modal opens
  useEffect(() => {
    if (isOpen && liveSearch) {
      setEditLabel(liveSearch.label);
      setEditUrl(liveSearch.url);
      setCurrencyConditions(
        liveSearch.currencyConditions?.map((condition, index) => ({
          id: `condition-${index}`,
          currency: condition.currency,
          minPrice: condition.minPrice,
          maxPrice: condition.maxPrice,
        })) || []
      );
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
        currencyConditions: currencyConditions
          .filter((condition) => condition.currency) // Only include conditions with currency selected
          .filter((condition) => {
            // Don't persist if min is 0 and max is undefined or 0
            const minIsZero =
              condition.minPrice === 0 || condition.minPrice === undefined;
            const maxIsZeroOrUndefined =
              condition.maxPrice === 0 || condition.maxPrice === undefined;
            return !(minIsZero && maxIsZeroOrUndefined);
          })
          .map((condition) => ({
            currency: condition.currency as Poe2Currency,
            minPrice: condition.minPrice,
            maxPrice: condition.maxPrice,
          })),
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
      setCurrencyConditions(
        liveSearch.currencyConditions?.map((condition, index) => ({
          id: `condition-${index}`,
          currency: condition.currency,
          minPrice: condition.minPrice,
          maxPrice: condition.maxPrice,
        })) || []
      );

      electronAPI.screen.hideGridOverlay();
    }
    setIsOpen(false);
  };

  const handleClose = () => {
    handleCancel();
  };

  // Currency condition management functions
  const addCurrencyCondition = () => {
    const newCondition: CurrencyCondition = {
      id: `condition-${Date.now()}`,
      currency: undefined,
      minPrice: undefined,
      maxPrice: undefined,
    };
    setCurrencyConditions([...currencyConditions, newCondition]);
  };

  const removeCurrencyCondition = (id: string) => {
    setCurrencyConditions(
      currencyConditions.filter((condition) => condition.id !== id)
    );
  };

  const updateCurrencyCondition = (
    id: string,
    updates: Partial<CurrencyCondition>
  ) => {
    setCurrencyConditions(
      currencyConditions.map((condition) =>
        condition.id === id ? { ...condition, ...updates } : condition
      )
    );
  };

  return (
    <ModalBase
      onClose={handleClose}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      className="card max-w-2xl w-full"
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

        {/* Currency Conditions Section */}
        <div className="space-y-4">
          <div className="flex items-end justify-between border-gray-700 border-t pt-3 mt-3">
            <div className="text-xs text-gray-300">
              <h4 className="text-xl font-bold text-gray-300">
                Price Conditions:
              </h4>
              <p className="mb-2">
                Prevent auto-teleporting to hideouts with items priced in
                unwanted currencies. Avoid miscalculations when different
                currencies have varying exchange rates compared to your max
                price settings.
              </p>
              <div className="space-y-1">
                <p className="font-medium text-gray-200">Benefits:</p>
                <ul className="list-disc list-inside space-y-0.5 ml-2">
                  <li>Filter out items priced in currencies you don't want</li>
                  <li>
                    Ensure auto-actions only trigger for preferred currency
                    pricing
                  </li>
                  <li>
                    Prevent budget miscalculations from currency conversion
                    differences
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-medium text-gray-600 text-nowrap">
                ({currencyConditions.length} conditions)
              </span>
              <Button
                size="small"
                variant="outline"
                onClick={addCurrencyCondition}
                className="text-xs"
              >
                + Add Condition
              </Button>
            </div>
          </div>

          {currencyConditions.length === 0 ? (
            <div className="text-sm text-gray-400 italic text-center py-4 border-2 border-dashed border-gray-700 rounded bg-gray-900/50">
              No currency conditions added. Click "Add Condition" to create one.
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-[300px] border p-2 border-gray-700 rounded">
              {currencyConditions.map((condition, index) => (
                <div
                  key={condition.id}
                  className="flex items-center gap-3 p-3 bg-black border border-gray-700 rounded backdrop-blur-sm"
                >
                  <span className="text-sm font-medium text-gray-300 w-8">
                    #{index + 1}
                  </span>

                  {/* Currency Dropdown */}
                  <div className="flex-1 min-w-0">
                    <Dropdown
                      options={currencyOptions}
                      value={
                        condition.currency
                          ? currencyOptions.find(
                              (opt) => opt.value === condition.currency
                            )
                          : null
                      }
                      onChange={(option) =>
                        updateCurrencyCondition(condition.id, {
                          currency: option.value as Poe2Currency,
                        })
                      }
                      placeholder="Select currency"
                      className="w-full"
                    />
                  </div>

                  {/* Min Price Input */}
                  <div className="w-24">
                    <Input
                      value={condition.minPrice?.toString() || "0"}
                      onChange={(value) =>
                        updateCurrencyCondition(condition.id, {
                          minPrice: value ? Number(value) : undefined,
                        })
                      }
                      placeholder="Min"
                      type="number"
                      className="text-sm"
                      min={0}
                    />
                  </div>

                  {/* Max Price Input */}
                  <div className="w-24">
                    <Input
                      value={condition.maxPrice?.toString() || ""}
                      onChange={(value) =>
                        updateCurrencyCondition(condition.id, {
                          maxPrice: value ? Number(value) : undefined,
                        })
                      }
                      placeholder="Max"
                      type="number"
                      className="text-sm"
                      min={0}
                    />
                  </div>

                  {/* Remove Button */}
                  <Button
                    size="small"
                    variant="danger"
                    onClick={() => removeCurrencyCondition(condition.id)}
                    className="px-2 py-1 text-xs"
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          )}
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
