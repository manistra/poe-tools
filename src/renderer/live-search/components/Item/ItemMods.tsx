import React from "react";
import { TransformedItemData } from "../../../../shared/types";
import clsx from "clsx";

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

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
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
