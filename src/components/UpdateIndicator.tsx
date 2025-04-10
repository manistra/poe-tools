import React, { useState, useEffect } from "react";

const UpdateIndicator = () => {
  const [updateStatus, setUpdateStatus] = useState("");
  const [appVersion, setAppVersion] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Get current app version
    window.electron.updates.getAppVersion().then((version) => {
      setAppVersion(version);
    });

    // Listen for update status changes
    const unsubscribe = window.electron.updates.onUpdateStatus((status) => {
      setUpdateStatus(status);

      // Check if an update is in progress
      if (status.includes("Downloading update")) {
        setIsUpdating(true);
      } else if (status.includes("Update downloaded")) {
        // Will restart soon
        setIsUpdating(true);
      } else if (status.includes("No update available")) {
        setIsUpdating(false);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  if (!isUpdating) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg flex items-center">
      <svg
        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <span>Updating application...</span>
    </div>
  );
};

export default UpdateIndicator;
