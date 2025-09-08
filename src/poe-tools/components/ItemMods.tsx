import React from "react";
import { TransformedItemData } from "../live-search/types";

interface ItemModsProps {
  item: TransformedItemData;
}

const ItemMods: React.FC<ItemModsProps> = ({ item }) => {
  return (
    <div className="flex flex-col gap-2 text-center border border-gray-800 bg-black rounded p-3 w-full h-full flex-1 justify-center">
      <h1 className="text-lg text-poe-mods-title">{item.name}</h1>
      <div className="text-sm text-gray-500">{item.typeLine}</div>

      <hr className="mx-3 border-gray-900" />

      {item.runeSockets !== undefined && (
        <div>
          <h4 className="text-sm text-gray-400">
            Runes sockets: {item.runeSockets}
          </h4>
          <div className="flex-col flex">
            {item.runeMods.length > 0 &&
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
      {item.corrupted && <div className="text-sm text-red-700">Corrupted</div>}
    </div>
  );
};

export default ItemMods;
