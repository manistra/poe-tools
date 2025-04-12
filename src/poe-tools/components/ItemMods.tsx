import React from "react";
import { TransformedItemData } from "../query-weapons-with-amazon-accuracy/utils/calcs/types";

interface ItemModsProps {
  item: TransformedItemData;
}

const ItemMods: React.FC<ItemModsProps> = ({ item }) => {
  return (
    <div className="flex flex-col gap-2 text-center border border-gray-800 bg-black rounded p-3 w-full m-2">
      <h1 className="text-lg text-poe-mods-title">{item.name}</h1>

      <hr className="mx-3 border-gray-900" />

      <div className="">
        {item.runeMods && item.runeMods.length > 0 && (
          <>
            <h4 className="text-sm text-gray-400">Runes:</h4>
            <div className="flex-col flex">
              {item.runeMods.map((mod: string, i: number) => (
                <div key={i} className="text-sm text-poe-mods-enchanted">
                  {mod}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <hr className="mx-3 border-gray-900" />

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
    </div>
  );
};

export default ItemMods;
