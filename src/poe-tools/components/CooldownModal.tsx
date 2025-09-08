import React, { useEffect, useState } from "react";
import ModalBase from "src/components/Modal";
import { ItemData } from "../live-search/utils/types";
import Item from "./Item/Item";
import { transformItemData } from "../live-search/utils/transformItemData";
import { mockData } from "../../mockData";

interface CooldownModalProps {
  isOpen: boolean;
  setIsCooldownOpen: (isOpen: boolean) => void;
  cooldownTime: number;
  lastWhisperItem?: ItemData;
  onClearCooldown: () => void;
}

const CooldownModal: React.FC<CooldownModalProps> = ({
  isOpen,
  setIsCooldownOpen,
  cooldownTime,
  lastWhisperItem,
  onClearCooldown,
}) => {
  const [remainingTime, setRemainingTime] = useState(cooldownTime);

  useEffect(() => {
    if (!isOpen || cooldownTime <= 0) return;

    setRemainingTime(cooldownTime);

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        const newTime = prev - 1000;
        if (newTime <= 0) {
          clearInterval(interval);
          setIsCooldownOpen(false);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, cooldownTime, setIsCooldownOpen]);

  const formatTime = (milliseconds: number) => {
    const seconds = Math.ceil(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    }
    return `${remainingSeconds}s`;
  };

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
        ⚡ Telepored to buy:
      </h1>

      {lastWhisperItem && (
        <div className="scale-110 m-10">
          <Item item={transformItemData(lastWhisperItem)} />
        </div>
      )}
      <div className="flex flex-col items-center gap-3 justify-center">
        <span className="text-white text-2xl">
          Auto teleport on cooldown for:
        </span>
        <span className="font-bold text-yellow-500 text-7xl">
          {formatTime(remainingTime)}
        </span>
        <span className="text-xl text-gray-600">
          Press anywhere or the button below to clear the cooldown.
        </span>
        <button
          onClick={handleClearCooldown}
          className="px-10 py-4 bg-red-900 hover:bg-red-800 text-white rounded text-4xl font-medium transition-colors"
        >
          Clear Cooldown
        </button>
      </div>
    </ModalBase>
  );
};

export default CooldownModal;
