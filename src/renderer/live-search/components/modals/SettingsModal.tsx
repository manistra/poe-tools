import React, { useState, useEffect } from "react";
import ModalBase from "src/renderer/components/Modal";
import Input from "src/renderer/components/Input";
import Button from "src/renderer/components/Button";
import Checkbox from "src/renderer/components/Checkbox";
import Dropdown, { DropdownOption } from "src/renderer/components/Dropdown";
import {
  usePoeSessionId,
  useWebSocketSessionId,
  useDisableSounds,
  useSelectedSounds,
} from "src/shared/store/hooks";
import { SoundType } from "src/shared/types";
import { electronAPI } from "src/renderer/api/electronAPI";

interface SettingsModalProps {
  isOpen: boolean;
  setIsSettingsOpen: (isOpen: boolean) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  setIsSettingsOpen,
}) => {
  const [storedSessionId, setStoredSessionId] = usePoeSessionId();
  const [localSessionId, setLocalSessionId] = useState("");

  const [storedWebSocketSessionId, setStoredWebSocketSessionId] =
    useWebSocketSessionId();
  const [localWebSocketSessionId, setLocalWebSocketSessionId] = useState("");

  const [disableSounds, setDisableSounds] = useDisableSounds();
  const [selectedSounds, setSelectedSounds] = useSelectedSounds();

  // Sound options for dropdowns
  const soundOptions: DropdownOption[] = [
    { id: "none", label: "None", value: "none" },
    { id: "whisper", label: "Whisper", value: "whisper" },
    { id: "teleport", label: "Teleport", value: "teleport" },
    { id: "teleport_2", label: "Teleport 2", value: "teleport_2" },
    { id: "teleport_3", label: "Teleport 3", value: "teleport_3" },
    { id: "ping", label: "Ping", value: "ping" },
    { id: "notification", label: "Notification", value: "notification" },
    { id: "evo_item", label: "Evo Item Bog Te Jebo", value: "evo_item" },
  ];

  // Function to play sound when dropdown selection changes
  const handleSoundSelection = async (
    soundType: SoundType | "none",
    soundKey: "whisper" | "teleport" | "ping"
  ) => {
    // Update the selected sounds
    setSelectedSounds({ ...selectedSounds, [soundKey]: soundType });

    // Play the sound if it's not "none" and sounds are not disabled
    if (soundType !== "none") {
      try {
        await electronAPI.sound.playSound(soundType as SoundType);
      } catch (error) {
        console.error("Failed to play sound:", error);
      }
    }
  };

  // Load the stored session ID into local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalSessionId(storedSessionId);
      setLocalWebSocketSessionId(storedWebSocketSessionId);
    }
  }, [isOpen, storedSessionId]);

  const handleSessionIdSet = () => {
    setStoredSessionId(localSessionId);
    setStoredWebSocketSessionId(localWebSocketSessionId);
    setIsSettingsOpen(false);
  };

  return (
    <ModalBase
      onClose={() => setIsSettingsOpen(false)}
      isOpen={isOpen}
      setIsOpen={setIsSettingsOpen}
      className="card max-w-2xl w-full"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <div className="space-y-4 border-b border-gray-700 pb-4">
            <h3 className="text-lg font-semibold text-gray-200 mb-2">
              Session Configuration
            </h3>
            <Input
              label="POESESSIONID:"
              value={localSessionId}
              onChange={(value) => setLocalSessionId(value.toString())}
            />
            <Input
              label="WEB-SOCKET POESESSIONID:"
              value={localWebSocketSessionId}
              onChange={(value) => setLocalWebSocketSessionId(value.toString())}
            />
            <Button
              size="small"
              variant="success"
              className="ml-auto"
              onClick={() => handleSessionIdSet()}
            >
              Save Session IDs
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-200 mb-2">
              Sound Configuration
            </h3>
            <Checkbox
              label="Disable All Sounds"
              checked={disableSounds}
              onChange={setDisableSounds}
            />

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Whisper Sound:
                </label>
                <Dropdown
                  options={soundOptions}
                  value={
                    soundOptions.find(
                      (option) => option.value === selectedSounds.whisper
                    ) || soundOptions[0]
                  }
                  onChange={(option) =>
                    handleSoundSelection(
                      option.value as SoundType | "none",
                      "whisper"
                    )
                  }
                  placeholder="Select whisper sound"
                  disabled={disableSounds}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Teleport Sound:
                </label>
                <Dropdown
                  options={soundOptions}
                  value={
                    soundOptions.find(
                      (option) => option.value === selectedSounds.teleport
                    ) || soundOptions[0]
                  }
                  onChange={(option) =>
                    handleSoundSelection(
                      option.value as SoundType | "none",
                      "teleport"
                    )
                  }
                  placeholder="Select teleport sound"
                  disabled={disableSounds}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Ping Sound:
                </label>
                <Dropdown
                  options={soundOptions}
                  value={
                    soundOptions.find(
                      (option) => option.value === selectedSounds.ping
                    ) || soundOptions[0]
                  }
                  onChange={(option) =>
                    handleSoundSelection(
                      option.value as SoundType | "none",
                      "ping"
                    )
                  }
                  placeholder="Select ping sound"
                  disabled={disableSounds}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            size="small"
            variant="outline"
            onClick={() => setIsSettingsOpen(false)}
          >
            Close
          </Button>
        </div>
      </div>
    </ModalBase>
  );
};

export default SettingsModal;
