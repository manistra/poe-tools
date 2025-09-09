import { useState } from "react";

export const useLogs = () => {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (log: string) => {
    const logToAdd = `${new Date().toLocaleTimeString()} - ${log}`;

    setLogs((prevLogs) => [...prevLogs, logToAdd]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return {
    logs,
    addLog,
    clearLogs,
  };
};

export default useLogs;
