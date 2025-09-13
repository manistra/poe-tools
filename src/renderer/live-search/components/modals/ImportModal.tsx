import React, { useState } from "react";
import ModalBase from "src/renderer/components/Modal";
import Button from "src/renderer/components/Button";
import TextArea from "src/renderer/components/TextArea";
import { useLiveSearchContext } from "../../context/hooks/useLiveSearchContext";

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
  const { importLiveSearches } = useLiveSearchContext();

  const handleImport = () => {
    setImportError("");

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
  {"label": "search Label value", "url": "searchUrl Value"},
  {"label": "search Label value", "url": "searchUrl Value"}
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
