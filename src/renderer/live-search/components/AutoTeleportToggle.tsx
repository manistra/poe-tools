import React from "react";
import { useAutoWhisper } from "src/shared/store/hooks";

const AutoTeleportToggle: React.FC = () => {
  const [autoTeleport, updateAutoWhisper] = useAutoWhisper();

  return (
    <div className="flex items-center flex-row gap-2 mt-2">
      <label className="flex items-center gap-2 text-sm text-gray-300">
        <input
          type="checkbox"
          checked={autoTeleport}
          onChange={(e) => updateAutoWhisper(e.target.checked)}
          className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
        />
        <span className="text-sm whitespace-nowrap">Auto-Teleport ⚡</span>
      </label>
    </div>
  );
};

export default AutoTeleportToggle;
