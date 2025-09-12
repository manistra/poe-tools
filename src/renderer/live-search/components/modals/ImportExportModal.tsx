import React, { useState } from "react";
import ModalBase from "src/renderer/components/Modal";
import Button from "src/renderer/components/Button";
import TextArea from "src/renderer/components/TextArea";
import { copyToClipboard } from "../../../helpers/clipboard";
import { useLiveSearchContext } from "../context/hooks/useLiveSearchContext";

interface ImportExportModalProps {
  isOpen: boolean;
  setIsImportExportOpen: (isOpen: boolean) => void;
}

const ImportExportModal: React.FC<ImportExportModalProps> = ({
  isOpen,
  setIsImportExportOpen,
}) => {
  const [importData, setImportData] = useState("");
  const [importError, setImportError] = useState("");
  const {
    liveSearches,
    deleteAllLiveSearches,
    importLiveSearches,
    ws: { disconnectAll },
  } = useLiveSearchContext();

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

  const handleExport = async () => {
    try {
      const exportData = liveSearches.map((liveSearch) => ({
        label: liveSearch.label,
        url: liveSearch.url,
      }));

      const jsonString = JSON.stringify(exportData, null, 2);
      await copyToClipboard(jsonString);
      alert(`Exported ${liveSearches.length} live searches to clipboard!`);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export live searches");
    }
  };

  const handleDeleteAll = async () => {
    if (liveSearches.length === 0) {
      alert("No live searches to delete!");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ALL ${liveSearches.length} live searches? This action cannot be undone!`
    );

    if (confirmed) {
      await deleteAllLiveSearches();

      setIsImportExportOpen(false);
    }
  };

  const handleClose = () => {
    setImportData("");
    setImportError("");
    setIsImportExportOpen(false);
  };

  const handleForceStopAll = async () => {
    await disconnectAll();

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
          Live Search Import/Export
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

          <div className="flex gap-2 flex-wrap justify-between">
            <div className="flex flex-col gap-1">
              <Button size="small" variant="outline" onClick={handleExport}>
                Export All Live Searches
              </Button>
              <Button size="small" variant="danger" onClick={handleDeleteAll}>
                Delete All Live Searches
              </Button>
              <Button
                size="small"
                variant="danger"
                onClick={handleForceStopAll}
              >
                Force Stop All Live Searches
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                size="small"
                variant="success"
                onClick={handleImport}
                disabled={!importData.trim()}
              >
                Import Live Searches
              </Button>
              <Button
                size="small"
                variant="outline"
                className="ml-auto"
                onClick={handleClose}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ModalBase>
  );
};

export default ImportExportModal;
