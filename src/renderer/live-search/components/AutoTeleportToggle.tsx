import React from "react";
import { useAutoTeleport, useAutoWhisper } from "src/shared/store/hooks";

const AutoTeleportToggle: React.FC = () => {
  const [autoTeleport, updateAutoTeleport] = useAutoTeleport();
  const [autoWhisper, updateAutoWhisper] = useAutoWhisper();

  return (
    <div className="flex items-center flex-col gap-2">
      <label className="flex items-center gap-2 text-sm text-gray-300">
        <input
          type="checkbox"
          checked={autoTeleport}
          onChange={(e) => updateAutoTeleport(e.target.checked)}
          className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
        />
        <span className="text-sm whitespace-nowrap">Auto-Teleport ⚡</span>
      </label>
      <label className="flex items-center gap-2 text-sm text-gray-300">
        <input
          type="checkbox"
          checked={autoWhisper}
          onChange={(e) => updateAutoWhisper(e.target.checked)}
          className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
        />
        <span className="text-sm whitespace-nowrap">Auto-Whisper 💬</span>
      </label>
    </div>
  );
};

export default AutoTeleportToggle;
