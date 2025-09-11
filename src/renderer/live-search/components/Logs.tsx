import React from "react";
import CollapsibleItem from "src/renderer/components/CollapsibleItem";

const Logs: React.FC<{ logs: string[] }> = ({ logs }) => {
  // Placeholder for logs display
  return (
    <CollapsibleItem
      title="Logs:"
      specialTitle={
        logs[logs.length - 1]
          ? `Last log - ${logs[logs.length - 1]}`
          : undefined
      }
    >
      <div className="max-h-[300px] overflow-y-auto">
        {logs.length === 0 ? (
          <p>No messages received yet</p>
        ) : (
          <ul className="flex flex-col-reverse gap-2">
            {logs.map((log, index) => (
              <li key={index}>{log}</li>
            ))}
          </ul>
        )}
      </div>
    </CollapsibleItem>
  );
};

export default Logs;
