import React, { useState } from "react";

import ModalBase from "src/renderer/components/Modal";
import { useLogs } from "src/shared/store/hooks";
import { Log } from "src/shared/store/storeUtils";

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
        <div className="flex flex-row gap-2 justify-end p-1 border-b border-gray-900 mb-2">
          <h1>Logs:</h1>

          <button
            className="text-gray-400 ml-auto hover:text-gray-200"
            onClick={clearLogs}
          >
            Clear Logs
          </button>
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
