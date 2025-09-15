import React, { useEffect, useState } from "react";
import ModalBase from "src/renderer/components/Modal";

import {
  useIsTeleportingBlocked,
  useLastTeleportedItem,
  useGridEnabled,
} from "src/shared/store/hooks";
import Item from "../Listings/components/Item";
import { TransformedItemData } from "src/shared/types";
import { useLiveSearchContext } from "../../context/hooks/useLiveSearchContext";
import { electronAPI } from "src/renderer/api/electronAPI";

const LastTeleportedItemModal: React.FC = () => {
  const { ws } = useLiveSearchContext();
  const [isOpen, setIsOpen] = useState(false);
  const [lastTeleportedItem, setLastTeleportedItem] = useLastTeleportedItem();
  const [, setIsTeleportingBlocked] = useIsTeleportingBlocked();
  const [gridEnabled] = useGridEnabled();
  const [timeLeft, setTimeLeft] = useState(40);

  const handleClose = async () => {
    setIsTeleportingBlocked(false);
    setLastTeleportedItem({
      ...lastTeleportedItem,
      alreadyTeleported: true,
    } as TransformedItemData & { alreadyTeleported?: boolean });
    setIsOpen(false);
    await electronAPI.screen.hideGridOverlay();
  };
  const handleCloseAndCancelAll = () => {
    ws.cancelAllAndDisconnect();
    handleClose();
  };

  useEffect(() => {

    const open = lastTeleportedItem !== null &&
      lastTeleportedItem &&
      !lastTeleportedItem?.alreadyTeleported
    if (open) {
      setIsOpen(
        open
      );


      // Show grid overlay if enabled, use coordinates if available, otherwise use center
      if (gridEnabled && lastTeleportedItem?.stash?.x !== undefined && lastTeleportedItem?.stash?.y !== undefined) {
        const x = lastTeleportedItem.stash.x;
        const y = lastTeleportedItem.stash.y;
        
        if(x >= 0 && y >= 0) 
        electronAPI.screen.showGridOverlay(x, y);
      } else {
        console.log("Grid overlay skipped for item:", {
          itemId: lastTeleportedItem?.id,
          itemName: lastTeleportedItem?.name,
          gridEnabled,
          hasCoords: !!(lastTeleportedItem?.stash?.x !== undefined && lastTeleportedItem?.stash?.y !== undefined)
        });
      }
    }

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
            Click the button below (or anywhere around) to continue or wait for
            for cooldown to expire.
          </span>
        </span>
        <button
          onClick={async () => await handleClose()}
          className="px-10 py-4 bg-gradient-to-br from-green-600 to-green-950 hover:from-green-700 hover:to-green-800 transition-colors text-white rounded text-4xl font-medium duration-300 w-[300px]"
        >
          Unblock
        </button>

        <button
          onClick={handleCloseAndCancelAll}
          className="text-gray-400 hover:text-gray-200 transition-colors duration-200 opacity-40 hover:opacity-100"
        >
          🚫
          <span className="underline">
            Click here to stop all searches and close{" "}
          </span>
          🚫
        </button>
      </div>
    </ModalBase>
  );
};

export default LastTeleportedItemModal;
