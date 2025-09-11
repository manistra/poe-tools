import React, { useState, useEffect } from "react";
import ModalBase from "src/renderer/components/Modal";
import Input from "src/renderer/components/Input";
import Button from "src/renderer/components/Button";
import { usePoeSessionId } from "src/shared/store/hooks";

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

  // Load the stored session ID into local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalSessionId(storedSessionId);
    }
  }, [isOpen, storedSessionId]);

  const handleSessionIdSet = (id: string) => {
    setStoredSessionId(id);
    setIsSettingsOpen(false);
  };

  return (
    <ModalBase
      onClose={() => setIsSettingsOpen(false)}
      isOpen={isOpen}
      setIsOpen={setIsSettingsOpen}
      className="card max-w-md w-full"
    >
      <div className="flex flex-col gap-2">
        <Input
          label="POESESSIONID:"
          value={localSessionId}
          onChange={(value) => setLocalSessionId(value.toString())}
        />

        <div className="ml-auto flex gap-2">
          <Button
            size="small"
            variant="outline"
            className="ml-auto"
            onClick={() => setIsSettingsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            size="small"
            variant="success"
            className="ml-auto"
            onClick={() => handleSessionIdSet(localSessionId)}
          >
            Save
          </Button>
        </div>
      </div>
    </ModalBase>
  );
};

export default SettingsModal;
