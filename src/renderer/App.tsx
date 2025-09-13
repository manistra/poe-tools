import React, { useState } from "react";

import SettingsModal from "./live-search/components/modals/SettingsModal";
import ImportExportModal from "./live-search/components/modals/ImportExportModal";
import PoeLiveSearch from "./live-search/PoeLiveSearch";
import ApiTester from "./components/ApiTester";
import { Cog6ToothIcon, DocumentTextIcon } from "@heroicons/react/24/solid";
import { useIsTeleportingBlocked } from "src/shared/store/hooks";

export default function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [isTeleportingBlocked, setIsTeleportingBlocked] =
    useIsTeleportingBlocked();
  return (
    <div>
      {isTeleportingBlocked && (
        <div className="flex-col flex gap-1 items-center justify-center border-b border-l top-0 right-0 absolute border-red-900 p-3 z-30 bg-red-950 text-red-200 bg-opacity-25">
          <span className="font-bold text-red-200 animate-pulse text-3xl">
            Auto Teleport Blocked
          </span>

          <span className="text-red-200 text-base">
            Press the button below to unblock.
          </span>
          <button
            className="text-red-200 text-base bg-green-900 border-green-700 border px-4  rounded-md"
            onClick={() => setIsTeleportingBlocked(false)}
          >
            Unblock
          </button>
        </div>
      )}
      <div className="absolute top-0 left-0 flex flex-row gap-2">
        <button onClick={() => setIsSettingsOpen(true)}>
          <Cog6ToothIcon className="size-10 m-2 hover:rotate-180 transition-transform duration-300 text-gray-400" />
        </button>

        <button onClick={() => setIsImportExportOpen(true)}>
          <DocumentTextIcon className="size-10 m-2 hover:scale-110 transition-transform duration-300 text-gray-400" />
        </button>
      </div>

      {false && (
        <div className="w-full overflow-hidden flex flex-col gap-5 card max-w-[1000px] mx-auto">
          <ApiTester />
        </div>
      )}

      <PoeLiveSearch />

      <SettingsModal
        isOpen={isSettingsOpen}
        setIsSettingsOpen={setIsSettingsOpen}
      />

      <ImportExportModal
        isOpen={isImportExportOpen}
        setIsImportExportOpen={setIsImportExportOpen}
      />
    </div>
  );
}
