import React, { useState } from "react";
import ModalBase from "src/components/Modal";
import Button from "src/components/Button";
import TextArea from "src/components/TextArea";
import {
  getSearchConfigs,
  addSearchConfig,
  deleteAllSearchConfigs,
} from "../live-search/utils/searchConfigManager";
import { copyToClipboard } from "../utils/clipboard";

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

      // Add each search config
      parsedData.forEach((item: { label: string; url: string }) => {
        addSearchConfig({
          label: item.label,
          url: item.url,
          isActive: true,
        });
      });

      setImportData("");
      setImportError("");
      alert(`Successfully imported ${parsedData.length} live searches!`);

      // Close modal and force refresh the page
      setIsImportExportOpen(false);
      window.location.reload();
    } catch (error) {
      setImportError(
        error instanceof Error ? error.message : "Invalid JSON format"
      );
    }
  };

  const handleExport = async () => {
    try {
      const activeConfigs = getSearchConfigs().filter(
        (config) => config.isActive
      );
      const exportData = activeConfigs.map((config) => ({
        label: config.label,
        url: config.url,
      }));

      const jsonString = JSON.stringify(exportData, null, 2);
      await copyToClipboard(jsonString);
      alert(
        `Exported ${activeConfigs.length} active live searches to clipboard!`
      );
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export live searches");
    }
  };

  const handleDeleteAll = () => {
    const allConfigs = getSearchConfigs();
    if (allConfigs.length === 0) {
      alert("No live searches to delete!");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ALL ${allConfigs.length} live searches? This action cannot be undone!`
    );

    if (confirmed) {
      deleteAllSearchConfigs();
      alert(`Successfully deleted all ${allConfigs.length} live searches!`);

      // Close modal and force refresh the page
      setIsImportExportOpen(false);
      window.location.reload();
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

          <div className="flex gap-2 flex-wrap">
            <Button
              size="small"
              variant="outline"
              onClick={handleImport}
              disabled={!importData.trim()}
            >
              Import
            </Button>
            <Button size="small" variant="success" onClick={handleExport}>
              Export All Active Live Searches (Blue Checkmark On)
            </Button>
            <Button size="small" variant="danger" onClick={handleDeleteAll}>
              Delete All Live Searches
            </Button>
          </div>
        </div>

        <div className="ml-auto flex gap-2 pt-2">
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
    </ModalBase>
  );
};

export default ImportExportModal;
