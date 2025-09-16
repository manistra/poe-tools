import React, { useState, useEffect } from "react";

import { useLiveSearchContext } from "../../context/hooks/useLiveSearchContext";
import LiveSearchItem from "./components/LiveSearchItem";
import NewLiveSearchForm from "./components/NewLiveSearchForm";
import {
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import clsx from "clsx";
import ImportModal from "../modals/ImportModal";
import { electronAPI } from "src/renderer/api/electronAPI";
import { useResults } from "src/shared/store/hooks";
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
} from "@heroicons/react/24/solid";

const LiveSearchesList: React.FC<{ isConnectingAll: boolean }> = ({
  isConnectingAll,
}) => {
  const [newFormOpen, setNewFormOpen] = useState(false);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Initialize from localStorage, default to false if not found
    const saved = localStorage.getItem("liveSearchesCollapsed");
    return saved ? JSON.parse(saved) : false;
  });
  const { results } = useResults();
  const { liveSearches, deleteAllLiveSearches } = useLiveSearchContext();

  const handleSetCollapsed = (value: boolean) => {
    setIsCollapsed(value);
    localStorage.setItem("liveSearchesCollapsed", JSON.stringify(value));
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
    }
  };

  const handleExport = async () => {
    try {
      const exportData = liveSearches.map((liveSearch) => ({
        label: liveSearch.label,
        url: liveSearch.url,
        currencyConditions: liveSearch.currencyConditions || [],
      }));

      const jsonString = JSON.stringify(exportData, null, 2);
      await electronAPI.poeTrade.copyToClipboard(jsonString);
      alert(
        `Exported ${liveSearches.length} live searches to clipboard! Paste them wherever you want! 😎`
      );
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export live searches");
    }
  };

  return (
    <div className="w-[500px] max-w-[500px] min-w-[500px] flex flex-col gap-5 card !pl-3">
      <div className="flex flex-row justify-between items-center border-b border-gray-900 mb-2 !ml-5">
        <h1 className="text-xl text-gray-300 mb-2">Live Searches</h1>

        <div className="flex flex-row">
          {!isCollapsed ? (
            <button
              title="Collapse Searches"
              onClick={() => handleSetCollapsed(true)}
              className={clsx(
                "text-xs p-1 transition-transform duration-200 opacity-60 hover:opacity-100 hover:scale-[104%]"
              )}
            >
              <ArrowsPointingInIcon className="size-[22px]" />
            </button>
          ) : (
            <button
              title="Expand Searches"
              onClick={() => handleSetCollapsed(false)}
              className={clsx(
                "text-xs p-1 transition-transform duration-200 opacity-60 hover:opacity-100 hover:scale-[104%]"
              )}
            >
              <ArrowsPointingOutIcon className="size-[22px]" />
            </button>
          )}

          <button
            title="Import Searches"
            onClick={() => setIsImportExportOpen(true)}
            className={clsx(
              "text-xs p-1 transition-transform duration-200 opacity-60 hover:opacity-100 hover:scale-[104%]"
            )}
          >
            <DocumentArrowDownIcon className="size-[22px]" />
          </button>

          <button
            title="Export Searches"
            onClick={() => handleExport()}
            className={clsx(
              "text-xs p-1 transition-transform duration-200 opacity-60 hover:opacity-100 hover:scale-[104%]"
            )}
          >
            <DocumentArrowUpIcon className="size-[22px]" />
          </button>

          <button
            title="Delete All Searches"
            onClick={() => handleDeleteAll()}
            className={clsx(
              "text-xs p-1 transition-transform duration-200 opacity-60 hover:opacity-100 hover:scale-[104%]",
              liveSearches.length === 0 && "opacity-30"
            )}
          >
            <TrashIcon className="size-[22px]" />
          </button>

          <button
            title="Add New Search"
            onClick={() => setNewFormOpen(!newFormOpen)}
            className={clsx(
              "text-xs p-1 transition-transform duration-200 opacity-60 hover:opacity-100 hover:scale-[104%]",
              newFormOpen && "rotate-45 opacity-50"
            )}
          >
            <PlusIcon className="size-6" strokeWidth={"3.5px"} />
          </button>
        </div>
      </div>

      <NewLiveSearchForm open={newFormOpen} setIsOpen={setNewFormOpen} />

      {liveSearches.length === 0 && (
        <p className="text-gray-400 text-sm">No live searches to show...</p>
      )}

      <div className="overflow-y-scroll h-full space-y-[6px]">
        {/* Existing Search Items */}
        {liveSearches.map((liveSearch, index) => {
          const resultsCount = results.filter(
            (result) => result.searchLabel === liveSearch.label
          ).length;

          return (
            <div
              key={liveSearch.id}
              className="w-full flex flex-row gap-1 items-center"
            >
              <span className="text-gray-600 text-[10px] font-bold w-4 h-4 flex items-center justify-center">
                {index + 1}.
              </span>
              <LiveSearchItem
                liveSearch={liveSearch}
                isConnectingAll={isConnectingAll}
                resultsCount={resultsCount}
                isCollapsed={isCollapsed}
              />
            </div>
          );
        })}
      </div>

      <ImportModal
        isOpen={isImportExportOpen}
        setIsImportExportOpen={setIsImportExportOpen}
      />
    </div>
  );
};

export default LiveSearchesList;
