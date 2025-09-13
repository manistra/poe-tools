import React, { useEffect, useState } from "react";
import ModalBase from "src/renderer/components/Modal";

import {
  useIsTeleportingBlocked,
  useLastTeleportedItem,
} from "src/shared/store/hooks";
import Item from "../Listings/components/Item";
import { TransformedItemData } from "src/shared/types";

const LastTeleportedItemModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [lastTeleportedItem, setLastTeleportedItem] = useLastTeleportedItem();
  const [, setIsTeleportingBlocked] = useIsTeleportingBlocked();
  const [timeLeft, setTimeLeft] = useState(40);

  const handleClose = () => {
    setIsTeleportingBlocked(false);
    setLastTeleportedItem({
      ...lastTeleportedItem,
      alreadyTeleported: true,
    } as TransformedItemData & { alreadyTeleported?: boolean });
    setIsOpen(false);
  };

  useEffect(() => {
    setIsOpen(
      lastTeleportedItem !== null &&
        lastTeleportedItem &&
        !lastTeleportedItem?.alreadyTeleported
    );
    console.log("lastTeleportedItem", lastTeleportedItem);
  }, [lastTeleportedItem]);

  useEffect(() => {
    if (!isOpen) return;

    setTimeLeft(40);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  return (
    <ModalBase
      onClose={handleClose}
      isOpen={isOpen}
      setIsOpen={handleClose}
      className="max-w-2xl w-full"
    >
      <h1 className="text-center text-[60px] font-bold text-white">
        ⚡ Teleported to buy:
      </h1>

      {lastTeleportedItem && (
        <div className="my-3">
          <Item item={lastTeleportedItem} />
        </div>
      )}
      <div className="flex flex-col items-center gap-3 justify-center">
        <div className="text-6xl font-bold text-yellow-400">{timeLeft}</div>

        <span className="text-white text-2xl text-center">
          Auto-Teleporting is <span className="text-red-500">BLOCKED</span>!{" "}
          <br />
          <span className="text-gray-400 text-xl">
            Press the button below to continue or wait for for cooldown to
            expire.
          </span>
        </span>
        <button
          onClick={handleClose}
          className="px-10 py-4 bg-gradient-to-br from-green-600 to-green-950 hover:from-green-700 hover:to-green-800 transition-colors text-white rounded text-4xl font-medium duration-300 w-[300px]"
        >
          Unblock
        </button>
      </div>
    </ModalBase>
  );
};

export default LastTeleportedItemModal;
