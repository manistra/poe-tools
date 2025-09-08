import React from "react";
import ModalBase from "src/components/Modal";
import { ItemData } from "../live-search/utils/types";
import Item from "./Item/Item";
import { transformItemData } from "../live-search/utils/transformItemData";
import { mockData } from "../../mockData";

interface CooldownModalProps {
  isOpen: boolean;
  setIsCooldownOpen: (isOpen: boolean) => void;
  lastWhisperItem?: ItemData;
  onClearCooldown: () => void;
}

const CooldownModal: React.FC<CooldownModalProps> = ({
  isOpen,
  setIsCooldownOpen,
  lastWhisperItem,
  onClearCooldown,
}) => {
  const handleClose = () => {
    onClearCooldown();
    setIsCooldownOpen(false);
  };

  const handleClearCooldown = () => {
    onClearCooldown();
    setIsCooldownOpen(false);
  };

  return (
    <ModalBase
      onClose={handleClose}
      isOpen={isOpen}
      setIsOpen={setIsCooldownOpen}
      className="max-w-2xl w-full"
    >
      <h1 className="text-center text-[60px] font-bold text-white">
        ⚡ Teleported to buy:
      </h1>

      {lastWhisperItem && (
        <div className="scale-125 my-24">
          <Item item={transformItemData(lastWhisperItem)} />
        </div>
      )}
      <div className="flex flex-col items-center gap-3 justify-center">
        <span className="text-white text-2xl text-center">
          Auto-Teleporting is <span className="text-red-500">BLOCKED</span>!{" "}
          <br />
          <span className="text-gray-400 text-xl">
            Close this modal to continue auto-whispering.
          </span>
        </span>
        <button
          onClick={handleClearCooldown}
          className="px-10 py-4 bg-green-600 hover:bg-green-700 text-white rounded text-4xl font-medium transition-colors"
        >
          Continue Auto-Teleporting
        </button>
      </div>
    </ModalBase>
  );
};

export default CooldownModal;
