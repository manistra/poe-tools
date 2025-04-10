import React from "react";
import { copyToClipboard } from "../utils/clipboard";
import { calculateTotalAccuracy } from "../utils/calculateAccuracy";
import CollapsibleItem from "../../components/CollapsibleItem";
const WhisperButton = ({ whisper }: { whisper: string }) => {
  const handleCopyWhisper = async () => {
    await copyToClipboard(whisper);
    // Optional: Add some visual feedback that the whisper was copied
  };

  return (
    <button
      onClick={handleCopyWhisper}
      className="px-2 py-3 bg-blue-900 text-white rounded hover:bg-blue-700 transition-colors text-xs text-nowrap"
    >
      Copy Whisper
    </button>
  );
};
interface ItemProperty {
  name: string;
  values: [string, number][];
  displayMode: number;
  type?: number;
}

interface ItemListing {
  account: {
    name: string;
  };
  price: {
    amount: number;
    currency: string;
  };
  whisper?: string;
}

interface ItemData {
  time: string;
  item: {
    properties: ItemProperty[];
    explicitMods?: string[];
    runeMods?: string[];
    fracturedMods?: string[];
    extended: {
      pdps: number;
      edps: number;
      dps: number;
    };
  };
  listing?: ItemListing;
}

interface ItemProps {
  item: ItemData;
}

const Item: React.FC<ItemProps> = ({ item }) => {
  const attackSpeed = item.item.properties.find(
    (property) => property.name === "Attacks per Second"
  );

  const physicalDamage = item.item.properties.find(
    (property) => property.name === "[Physical] Damage"
  );

  const fireDamage = item.item.properties.find(
    (property) => property.name === "[Fire] Damage"
  );

  const coldDamage = item.item.properties.find(
    (property) => property.name === "[Cold] Damage"
  );

  const lightningDamage = item.item.properties.find(
    (property) => property.name === "[Lightning] Damage"
  );

  const elementalDamageFind = item.item.properties.find(
    (property: any) => property.name === "[ElementalDamage|Elemental] Damage"
  );
  const elementalDamageValues = {
    fire: elementalDamageFind?.values.find(
      (val: [string, number]) => val[1] === 4
    )?.[0],
    cold: elementalDamageFind?.values.find(
      (val: [string, number]) => val[1] === 5
    )?.[0],
    lightning: elementalDamageFind?.values.find(
      (val: [string, number]) => val[1] === 6
    )?.[0],
  };

  const totalAccuracy = calculateTotalAccuracy(item.item);

  return (
    <div className="border border-gray-700 rounded-md p-2 bg-gray-800">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-16 justify-between">
          <div className="flex justify-between text-xs w-1/2 max-w-[300px] flex-col">
            <h3 className="font-medium flex flex-row w-full justify-between text-white">
              <span className="text-gray-400 ">Crit Chance:</span>
              {
                item.item.properties.find(
                  (property: any) =>
                    property.name === "[Critical|Critical Hit] Chance"
                )?.values[0][0]
              }
            </h3>
            <h3 className="font-medium flex flex-row w-full justify-between text-white">
              <span className="text-gray-400 ">Attacks per Second:</span>
              {attackSpeed?.values[0][0]}
            </h3>
            <h3 className="font-medium flex flex-row w-full justify-between text-white">
              <span className="text-gray-400 ">Physical Damage:</span>
              <span className="text-white">{physicalDamage?.values[0][0]}</span>
            </h3>
            <h3 className="font-medium flex flex-row w-full justify-between text-white">
              <span className="text-gray-400 ">Elemental Damage:</span>
              <span className="text-red-500">{elementalDamageValues.fire}</span>
              <span className="text-blue-400">
                {elementalDamageValues.cold}
              </span>
              <span className="text-yellow-400">
                {elementalDamageValues.lightning}
              </span>
            </h3>

            {fireDamage && (
              <h3 className="font-medium flex flex-row w-full justify-between text-white">
                <span className="text-gray-400 ">Fire Damage:</span>
                <span className="text-red-800">{fireDamage?.values[0][0]}</span>
              </h3>
            )}
            {coldDamage && (
              <h3 className="font-medium flex flex-row w-full justify-between text-white">
                <span className="text-gray-400 ">Cold Damage:</span>
                <span className="text-blue-400">
                  {coldDamage?.values[0][0]}
                </span>
              </h3>
            )}
            {lightningDamage && (
              <h3 className="font-medium flex flex-row w-full justify-between text-white">
                <span className="text-gray-400 ">Lightning Damage:</span>
                <span className="text-purple-500">
                  {lightningDamage?.values[0][0]}
                </span>
              </h3>
            )}

            {totalAccuracy > 0 && (
              <h3 className="font-medium flex flex-row w-full justify-between text-white">
                <span className="text-gray-400 ">Total Accuracy:</span>
                {totalAccuracy}
              </h3>
            )}
          </div>

          <div className="flex flex-col text-xs self-end w-1/2 max-w-[200px]">
            <h3 className="font-medium flex flex-row w-full justify-between text-white">
              <span className="text-gray-400">pDPS:</span>{" "}
              {item.item.extended.pdps}
            </h3>
            <h3 className="font-medium flex flex-row w-full justify-between text-white">
              <span className="">
                e<span className="text-orange-700">D</span>
                <span className="text-blue-400">P</span>
                <span className="text-purple-400">S</span>:
              </span>{" "}
              {item.item.extended.edps}
            </h3>
            <h3 className="font-medium flex flex-row w-full justify-between text-white">
              <span className="text-green-700 ">Total DPS:</span>{" "}
              {item.item.extended.dps}
            </h3>
            {totalAccuracy > 0 && (
              <h3 className="font-medium text-sm flex flex-row justify-between">
                <span className="text-green-500 text-xs">
                  Total DPS with Accuracy:
                </span>{" "}
                {Math.round(item.item.extended.dps + totalAccuracy / 4)}
              </h3>
            )}
          </div>
        </div>

        <CollapsibleItem title="Mods">
          <div className="flex flex-col gap-1">
            {item.item.runeMods && (
              <>
                <h4 className="text-sm text-gray-400">Rune Mods:</h4>
                <div className="bg-gray-900 p-2 rounded">
                  {item.item.runeMods?.map((mod: string, i: number) => (
                    <div key={i} className="text-sm">
                      {mod}
                    </div>
                  ))}
                </div>
              </>
            )}
            {item.item.fracturedMods && (
              <>
                <h4 className="text-sm text-gray-400">Fractured Mods:</h4>
                <div className="bg-gray-900 p-2 rounded">
                  {item.item.fracturedMods?.map((mod: string, i: number) => (
                    <div key={i} className="text-sm">
                      {mod}
                    </div>
                  ))}
                </div>
              </>
            )}
            <h4 className="text-sm text-gray-400">Mods:</h4>
            <div className="bg-gray-900 p-2 rounded">
              {item.item.explicitMods?.map((mod: string, i: number) => (
                <div key={i} className="text-sm">
                  {mod}
                </div>
              ))}
            </div>
          </div>
        </CollapsibleItem>
      </div>

      <div className="flex justify-between items-center mt-2">
        <div className="flex justify-between w-full">
          <div className="text-sm text-gray-200 mr-2 flex flex-col">
            <label className="text-xs text-gray-400">Seller:</label>
            <span className="text-gray-200">{item.listing?.account?.name}</span>
          </div>

          <div className="text-sm text-gray-200 mr-2 flex flex-col">
            <label className="text-xs text-gray-400">Time:</label>
            <span className="text-gray-200">{item.time}</span>
          </div>

          <div className="text-sm text-gray-200 mr-2 flex flex-col">
            <label className="text-xs text-gray-400">Price:</label>
            <span className="text-yellow-500 text-md">
              {item.listing?.price?.amount} {item.listing?.price?.currency}
            </span>
          </div>
        </div>

        {item.listing?.whisper && (
          <div className="mt-2">
            <WhisperButton whisper={item.listing?.whisper} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Item;
