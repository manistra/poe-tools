import React, { useState } from "react";
import ModalBase from "src/renderer/components/Modal";
import Button from "src/renderer/components/Button";
import TextArea from "src/renderer/components/TextArea";
import { useLiveSearchContext } from "../../context/hooks/useLiveSearchContext";
import { isWsStateAnyOf } from "src/renderer/helpers/isWsStateAnyOf";
import { WebSocketState } from "src/shared/types";
import { toast } from "react-hot-toast";

interface ImportExportModalProps {
  isOpen: boolean;
  setIsImportExportOpen: (isOpen: boolean) => void;
}

const ImportModal: React.FC<ImportExportModalProps> = ({
  isOpen,
  setIsImportExportOpen,
}) => {
  const [importData, setImportData] = useState("");
  const [importError, setImportError] = useState("");
  const { importLiveSearches, liveSearches } = useLiveSearchContext();

  const handleImport = () => {
    setImportError("");

    // Check for ongoing searches
    const hasActiveConnections = liveSearches.some(
      (search) => !isWsStateAnyOf(search.ws?.readyState, WebSocketState.CLOSED)
    );

    if (hasActiveConnections) {
      toast.error(
        "Cannot import while live searches are running. Please stop all searches first."
      );
      return;
    }

    try {
      const parsedData = JSON.parse(importData);

      // Validate the format
      if (!Array.isArray(parsedData)) {
        throw new Error("Data must be an array");
      }

      for (const item of parsedData) {
        if (!item.label || !item.url) {
          throw new Error("Each item must have 'label' and 'url' properties");
        }
        // Validate currencyConditions if present
        if (
          item.currencyConditions &&
          !Array.isArray(item.currencyConditions)
        ) {
          throw new Error("currencyConditions must be an array");
        }
      }

      importLiveSearches(parsedData);

      setImportData("");
      setImportError("");
      alert(`Successfully imported ${parsedData.length} live searches!`);

      // Close modal and force refresh the page
      setIsImportExportOpen(false);
    } catch (error) {
      setImportError(
        error instanceof Error ? error.message : "Invalid JSON format"
      );
    }
  };

  const handleClose = () => {
    setImportData("");
    setImportError("");
    setIsImportExportOpen(false);
  };

  return (
    <ModalBase
      onClose={handleClose}
      isOpen={isOpen}
      setIsOpen={setIsImportExportOpen}
      className="card max-w-2xl w-full"
    >
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold mb-3">
          📁 Paste your live searches here in JSON format and import them.
        </h3>

        <div className="space-y-4">
          <TextArea
            label="Import Live Searches (JSON format):"
            value={importData}
            onChange={(value) => setImportData(value.toString())}
            placeholder={`[
  {"label": "search Label value", "url": "searchUrl Value", "currencyConditions": []},
  {"label": "search Label value", "url": "searchUrl Value", "currencyConditions": [{"currency": "chaos", "minPrice": 1, "maxPrice": 10}]}
]`}
            className="min-h-[200px] font-mono text-sm"
            error={importError}
          />

          <div className="flex items-end gap-2 flex-col justify-between">
            <Button
              size="small"
              className="!w-40"
              variant="success"
              onClick={handleImport}
              disabled={!importData.trim()}
            >
              Import Live Searches
            </Button>
            <Button
              size="small"
              className="!w-40"
              variant="outline"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </ModalBase>
  );
};

export default ImportModal;
