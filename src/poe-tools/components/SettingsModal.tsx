import React, { useState } from "react";
import ModalBase from "src/components/Modal";
import Input from "src/components/Input";
import Button from "src/components/Button";

interface SettingsModalProps {
  isOpen: boolean;
  setIsSettingsOpen: (isOpen: boolean) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  setIsSettingsOpen,
}) => {
  const [sessionId, setSessionId] = useState(
    window.localStorage.getItem("poeSessionId") || ""
  );

  const handleSessionIdSet = (id: string) => {
    window.localStorage.setItem("poeSessionId", id);
    setIsSettingsOpen(false);
  };

  return (
    <ModalBase
      onClose={() =>
        setSessionId(window.localStorage.getItem("poeSessionId") || "")
      }
      isOpen={isOpen}
      setIsOpen={setIsSettingsOpen}
      className="card max-w-md w-full"
    >
      <div className="flex flex-col gap-2">
        <Input
          label="POESESSIONID:"
          value={sessionId}
          onChange={(value) => setSessionId(value.toString())}
        />

        <div className="ml-auto flex gap-2">
          <Button
            size="small"
            variant="outline"
            className="ml-auto"
            onClick={() => handleSessionIdSet(sessionId)}
          >
            Close
          </Button>
          <Button
            size="small"
            variant="success"
            className="ml-auto"
            onClick={() => handleSessionIdSet(sessionId)}
          >
            Save
          </Button>
        </div>
      </div>
    </ModalBase>
  );
};

export default SettingsModal;
