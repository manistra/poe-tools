import React from "react";
import CollapsibleItem from "src/renderer/components/CollapsibleItem";
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
  const { logs, clearLogs } = useLogs();

  return (
    <CollapsibleItem
      title="Logs:"
      specialTitle={
        logs.length > 0
          ? `${formatTimestamp(logs[0]?.timestamp || "")} - ${logs[0]?.message}`
          : undefined
      }
    >
      <div className="flex flex-row gap-2 justify-end">
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
    </CollapsibleItem>
  );
};

export default Logs;
