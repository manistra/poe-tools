import React from "react";
import { TransformedItemData } from "../../../../shared/types";
import clsx from "clsx";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

interface ItemModsProps {
  item: TransformedItemData;
}

const ItemMods: React.FC<ItemModsProps> = ({ item }) => {
  return (
    <div className="flex flex-col text-center border border-gray-800 bg-black bg-opacity-85 rounded w-full h-full flex-1">
      {item.searchLabel && (
        <div className="flex flex-row items-center justify-center py-2 border-b border-gray-800">
          <button className="flex flex-row items-center gap-1 text-gray-300 hover:text-blue-900 hover:underline cursor-pointer">
            <h1 className="font-bold text-center  truncate text-xl">
              {item.searchLabel}
            </h1>

            <ArrowTopRightOnSquareIcon className="size-6" />
          </button>
        </div>
      )}

      <div className="flex flex-col gap-2 text-center w-full h-full p-3 flex-1 justify-center bg-black">
        <h1
          className={clsx(
            "text-lg text-poe-mods-title",
            item.name.length > 0
              ? "text-poe-mods-title"
              : "text-poe-mods-regular"
          )}
        >
          {item.name || item.typeLine}
        </h1>
        <div className={clsx("text-sm text-gray-300 font-bold")}>
          {item.typeLine}
        </div>

        <hr className="mx-3 border-gray-900" />

        {item.runeSockets !== undefined && (
          <div>
            <h4 className="text-sm text-gray-400">
              Runes sockets: {item.runeSockets}
            </h4>
            <div className="flex-col flex">
              {item.runeMods &&
                item.runeMods.length > 0 &&
                item.runeMods.map((mod: string, i: number) => (
                  <div key={i} className="text-sm text-poe-mods-enchanted">
                    {mod}
                  </div>
                ))}
            </div>
            <hr className="mx-3 mt-2 border-gray-900" />
          </div>
        )}

        <div className="">
          <h4 className="text-sm text-gray-400">Mods:</h4>
          <div className="flex-col flex gap-1">
            {item.fracturedMods &&
              item.fracturedMods.length > 0 &&
              item.fracturedMods.map((mod: string, i: number) => (
                <span key={i} className="text-sm text-poe-mods-fractured">
                  {mod}
                </span>
              ))}

            {item.explicitMods?.map((mod: string, i: number) => (
              <span key={i} className="text-sm text-poe-mods-regular">
                {mod}
              </span>
            ))}
          </div>
        </div>
        {item.corrupted && (
          <div className="text-sm text-red-700">Corrupted</div>
        )}
      </div>
    </div>
  );
};

export default ItemMods;
