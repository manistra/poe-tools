import React from "react";
import toast from "react-hot-toast";
import { electronAPI } from "src/renderer/api/electronAPI";

import { useAutoTeleport, useAutoWhisper } from "src/shared/store/hooks";

const AutoBuyToggles: React.FC = () => {
  const [autoTeleport, updateAutoTeleport] = useAutoTeleport();
  const [autoWhisper, updateAutoWhisper] = useAutoWhisper();

  const handleAutoTeleportChange = (checked: boolean) => {
    updateAutoTeleport(checked);
    if (checked) {
      electronAPI.sound.playSound("teleport");
      toast.success(
        "You're gonna hear this sound on Auto-Teleport. (Change sound in settings)"
      );
    }
  };
  const handleAutoWhisperChange = (checked: boolean) => {
    updateAutoWhisper(checked);
    if (checked) {
      electronAPI.sound.playSound("whisper");
      toast.success(
        "You're gonna hear this sound on Auto-Whisper. (Change sound in settings)"
      );
    }
  };

  return (
    <div className="flex items-center flex-col gap-2">
      <label className="flex items-center gap-2 text-sm text-gray-300">
        <input
          type="checkbox"
          checked={autoTeleport}
          onChange={(e) => handleAutoTeleportChange(e.target.checked)}
          className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
        />
        <span className="text-sm whitespace-nowrap">Auto-Teleport ⚡</span>
      </label>
      <label className="flex items-center gap-2 text-sm text-gray-300">
        <input
          type="checkbox"
          checked={autoWhisper}
          onChange={(e) => handleAutoWhisperChange(e.target.checked)}
          className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
        />
        <span className="text-sm whitespace-nowrap">Auto-Whisper 💬</span>
      </label>
    </div>
  );
};

export default AutoBuyToggles;
