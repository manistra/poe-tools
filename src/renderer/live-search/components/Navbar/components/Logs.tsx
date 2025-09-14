import React, { useState } from "react";

import ModalBase from "src/renderer/components/Modal";
import { useLogs } from "src/shared/store/hooks";
import { Log } from "src/shared/store/storeUtils";
import {
  XMarkIcon,
  ClipboardDocumentIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { electronAPI } from "src/renderer/api/electronAPI";
import clsx from "clsx";
import { toast } from "react-hot-toast";

const formatTimestamp = (timestamp: string) => {
  return (
    new Date(timestamp).toLocaleTimeString() +
    "." +
    new Date(timestamp).getMilliseconds().toString().padStart(3, "0")
  );
};

const ViewLog: React.FC<{ log: Log }> = ({ log }) => {
  return (
    <li className="text-gray-200 flex flex-row gap-1 items-center">
      <span className="text-xs text-gray-400">
        [{formatTimestamp(log.timestamp)}] -{" "}
      </span>
      <span className="text-sm">{log.message}</span>
    </li>
  );
};

const Logs: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logs, clearLogs } = useLogs();

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleClearLogs = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear all logs? This action cannot be undone!"
    );
    if (!confirmed) {
      return;
    }
    clearLogs();
  };

  const handleCopyToClipboard = async () => {
    try {
      const logsText = logs
        .map((log) => `[${formatTimestamp(log.timestamp)}] - ${log.message}`)
        .join("\n");

      await electronAPI.poeTrade.copyToClipboard(logsText);
      toast.success("Logs copied to clipboard!");
    } catch (error) {
      console.error("Copy failed:", error);
      toast.error("Failed to copy logs to clipboard");
    }
  };

  return (
    <div className="w-full">
      {logs.length > 0 && (
        <button
          className="text-gray-400 text-xs hover:text-gray-200"
          onClick={() => setIsOpen(true)}
        >
          {logs[0]?.message}
        </button>
      )}

      <ModalBase
        onClose={handleClose}
        isOpen={isOpen}
        setIsOpen={() => setIsOpen(true)}
        className="card max-w-2xl w-full"
      >
        <div className="flex flex-row justify-between items-center border-b border-gray-900 mb-2 p-1">
          <h1 className="text-xl text-gray-300">Logs:</h1>

          <div className="flex flex-row">
            <button
              title="Copy to Clipboard"
              onClick={handleCopyToClipboard}
              className={clsx(
                "text-xs p-1 transition-transform duration-200 opacity-60 hover:opacity-100 hover:scale-[104%]",
                logs.length === 0 && "opacity-30"
              )}
              disabled={logs.length === 0}
            >
              <ClipboardDocumentIcon className="size-[22px]" />
            </button>

            <button
              title="Clear Logs"
              onClick={handleClearLogs}
              className={clsx(
                "text-xs p-1 transition-transform duration-200 opacity-60 hover:opacity-100 hover:scale-[104%]",
                logs.length === 0 && "opacity-30"
              )}
              disabled={logs.length === 0}
            >
              <TrashIcon className="size-[22px]" />
            </button>

            <button
              title="Close"
              onClick={handleClose}
              className="text-xs p-1 transition-transform duration-200 opacity-60 hover:opacity-100 hover:scale-[104%]"
            >
              <XMarkIcon className="size-[22px]" />
            </button>
          </div>
        </div>

        <div className="max-h-[300px] overflow-y-auto">
          {logs.length === 0 ? (
            <p>No messages received yet</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {logs.map((log, index) => (
                <ViewLog key={index} log={log} />
              ))}
            </ul>
          )}
        </div>
      </ModalBase>
    </div>
  );
};

export default Logs;
