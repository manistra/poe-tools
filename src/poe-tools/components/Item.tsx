import React from "react";
import { copyToClipboard } from "../utils/clipboard";
import CollapsibleItem from "../../components/CollapsibleItem";
import Button from "src/components/Button";
import { TransformedItemData } from "../utils/transformItemData";

const WhisperButton = ({ whisper }: { whisper: string }) => {
  const handleCopyWhisper = async () => {
    await copyToClipboard(whisper);
    // Optional: Add some visual feedback that the whisper was copied
  };

  return (
    <Button size="small" onClick={handleCopyWhisper}>
      Copy Whisper
    </Button>
  );
};

interface ItemProps {
  item: TransformedItemData;
}

const Item: React.FC<ItemProps> = ({ item }) => {
  return (
    <div className="border border-gray-700 rounded-md p-2 bg-gray-950">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-16 justify-between">
          <div className="flex justify-between text-xs w-1/2 max-w-[300px] flex-col">
            <h3 className="font-medium flex flex-row w-full justify-between text-white">
              <span className="text-gray-400 ">Crit Chance:</span>
              {item.criticalChance}
            </h3>
            <h3 className="font-medium flex flex-row w-full justify-between text-white">
              <span className="text-gray-400 ">Attacks per Second:</span>
              {item.attacksPerSecond}
            </h3>
            <h3 className="font-medium flex flex-row w-full justify-between text-white">
              <span className="text-gray-400 ">Physical Damage:</span>
              <span className="text-white">{item.physicalDamage}</span>
            </h3>
            <h3 className="font-medium flex flex-row w-full justify-between text-white">
              <span className="text-gray-400 ">Elemental Damage:</span>
              <span className="text-red-500">{item.elementalDamage.fire}</span>
              <span className="text-blue-400">{item.elementalDamage.cold}</span>
              <span className="text-yellow-400">
                {item.elementalDamage.lightning}
              </span>
            </h3>

            {item.fireDamage && (
              <h3 className="font-medium flex flex-row w-full justify-between text-white">
                <span className="text-gray-400 ">Fire Damage:</span>
                <span className="text-red-800">{item.fireDamage}</span>
              </h3>
            )}
            {item.coldDamage && (
              <h3 className="font-medium flex flex-row w-full justify-between text-white">
                <span className="text-gray-400 ">Cold Damage:</span>
                <span className="text-blue-400">{item.coldDamage}</span>
              </h3>
            )}
            {item.lightningDamage && (
              <h3 className="font-medium flex flex-row w-full justify-between text-white">
                <span className="text-gray-400 ">Lightning Damage:</span>
                <span className="text-purple-500">{item.lightningDamage}</span>
              </h3>
            )}

            {item.totalAccuracy > 0 && (
              <h3 className="font-medium flex flex-row w-full justify-between text-white">
                <span className="text-gray-400 ">Total Accuracy:</span>
                {item.totalAccuracy}
              </h3>
            )}
          </div>

          <div className="flex flex-col text-xs self-end w-1/2 max-w-[200px]">
            <h3 className="font-medium flex flex-row w-full justify-between text-white">
              <span className="text-gray-400">pDPS:</span> {item.pdps}
            </h3>
            <h3 className="font-medium flex flex-row w-full justify-between text-white">
              <span className="">
                e<span className="text-orange-700">D</span>
                <span className="text-blue-400">P</span>
                <span className="text-purple-400">S</span>:
              </span>{" "}
              {item.edps}
            </h3>
            <h3 className="font-medium flex flex-row w-full justify-between text-white">
              <span className="text-green-700 ">Total DPS:</span> {item.dps}
            </h3>
            {item.totalAccuracy > 0 && (
              <h3 className="font-medium text-sm flex flex-row justify-between">
                <span className="text-green-500 text-xs">
                  Total DPS with Accuracy:
                </span>{" "}
                {item.dpsWithAccuracy}
              </h3>
            )}
          </div>
        </div>

        <CollapsibleItem title="Mods">
          <div className="flex flex-col gap-1">
            {item.runeMods && item.runeMods.length > 0 && (
              <>
                <h4 className="text-sm text-gray-400">Rune Mods:</h4>
                <div className="bg-gray-900 p-2 rounded">
                  {item.runeMods.map((mod: string, i: number) => (
                    <div key={i} className="text-sm">
                      {mod}
                    </div>
                  ))}
                </div>
              </>
            )}
            {item.fracturedMods && item.fracturedMods.length > 0 && (
              <>
                <h4 className="text-sm text-gray-400">Fractured Mods:</h4>
                <div className="bg-gray-900 p-2 rounded">
                  {item.fracturedMods.map((mod: string, i: number) => (
                    <div key={i} className="text-sm">
                      {mod}
                    </div>
                  ))}
                </div>
              </>
            )}
            <h4 className="text-sm text-gray-400">Mods:</h4>
            <div className="bg-gray-900 p-2 rounded">
              {item.explicitMods?.map((mod: string, i: number) => (
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
            <span className="text-gray-200">{item.seller}</span>
          </div>

          <div className="text-sm text-gray-200 mr-2 flex flex-col">
            <label className="text-xs text-gray-400">Time:</label>
            <span className="text-gray-200">{item.time}</span>
          </div>

          <div className="text-sm text-gray-200 mr-2 flex flex-col">
            <label className="text-xs text-gray-400">Price:</label>
            <span className="text-yellow-500 text-md">
              {item.price?.amount} {item.price?.currency}
            </span>
          </div>
        </div>

        {item.whisper && (
          <div className="mt-2">
            <WhisperButton whisper={item.whisper} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Item;
