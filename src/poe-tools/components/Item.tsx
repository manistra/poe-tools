import React from "react";
import { copyToClipboard } from "../utils/clipboard";
import CollapsibleItem from "../../components/CollapsibleItem";
import Button from "src/components/Button";
import { TransformedItemData } from "../utils/transformItemData";
import DamageStat from "./DamageStat";

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
  calculateForAmazonAscendancy?: boolean;
}

const Item: React.FC<ItemProps> = ({
  item,
  calculateForAmazonAscendancy = false,
}) => {
  return (
    <div className="border border-gray-700 rounded-md p-2 bg-gray-950">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-16 justify-between">
          <div className="flex text-xs w-1/2 max-w-[350px] flex-col">
            <h2 className="text-gray-200 text-base ">Base Item Stats: </h2>

            <hr className="border-gray-700 mt-1 mb-3" />

            <DamageStat label="Crit Chance">{item.criticalChance}</DamageStat>
            <DamageStat label="Attacks per Second">
              {item.attacksPerSecond}
            </DamageStat>
            {!!item.elementalDamage.cold ||
              ((!!item.elementalDamage.fire ||
                !!item.elementalDamage.lightning) && (
                <DamageStat label="Elemental Damage">
                  <>
                    <span className="text-red-500">
                      {item.elementalDamage.fire}
                    </span>
                    <span className="text-blue-400">
                      {item.elementalDamage.cold}
                    </span>
                    <span className="text-yellow-400">
                      {item.elementalDamage.lightning}
                    </span>
                  </>
                </DamageStat>
              ))}
            {item.fireDamage && (
              <DamageStat label="Fire Damage">
                <span className="text-red-500">{item.fireDamage}</span>
              </DamageStat>
            )}
            {item.coldDamage && (
              <DamageStat label="Cold Damage">
                <span className="text-blue-400">{item.coldDamage}</span>
              </DamageStat>
            )}
            {item.lightningDamage && (
              <DamageStat label="Lightning Damage">
                <span className="text-purple-500">{item.lightningDamage}</span>
              </DamageStat>
            )}
            {item.totalAccuracy && (
              <DamageStat label="Total Accuracy">
                {item.totalAccuracy}
              </DamageStat>
            )}

            <DamageStat label="pDPS">{item.calculatedDamage.pdps}</DamageStat>
            <DamageStat label="eDPS">{item.calculatedDamage.edps}</DamageStat>
            <DamageStat label="Total DPS">
              {item.calculatedDamage.dps}
            </DamageStat>
          </div>

          <div className="flex text-xs w-1/2 max-w-[350px] flex-col">
            <h2 className="text-gray-200 text-base ">Calculated DPS: </h2>

            <hr className="border-gray-700 my-1" />

            <DamageStat label="Damage Without Runes">
              {item.calculatedDamage.totalDamageWithoutRuneMods.dps}
            </DamageStat>

            <DamageStat label="Physical Rune DPS">
              {
                item.calculatedDamage.runePotentialDpsValues
                  .potentialPhysRuneDps
              }
            </DamageStat>
            <DamageStat label="Elemental Rune DPS">
              {item.calculatedDamage.runePotentialDpsValues.potentialEleRuneDps}
            </DamageStat>

            {calculateForAmazonAscendancy && (
              <DamageStat label="Accuracy Rune DPS">
                {
                  item.calculatedDamage.runePotentialDpsValues
                    .potentialAccuracyRuneDps
                }
              </DamageStat>
            )}
            <DamageStat label="Attack Speed Rune DPS">
              {
                item.calculatedDamage.runePotentialDpsValues
                  .potentialAttackSpeedRuneDps
              }
            </DamageStat>

            <div className="mt-2">
              <label className="text-[10px] text-orange-500">
                Calculated higest overall highest DPS:{" "}
              </label>
              <h3 className="font-medium flex flex-row w-full justify-between text-white border p-1 my-1 rounded border-orange-500 pt-2 items-center">
                <span className="text-gray-200 ">
                  With{" "}
                  {
                    item.calculatedDamage.highestPotentialDpsValue
                      ?.numberOfRuneSockets
                  }{" "}
                  {item.calculatedDamage.highestPotentialDpsValue?.name}
                  {item.calculatedDamage.highestPotentialDpsValue
                    ?.numberOfRuneSockets > 1 && "s"}
                  :
                </span>
                <span className="text-base font-bold">
                  {item.calculatedDamage.highestPotentialDpsValue?.value}
                </span>
              </h3>
            </div>
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
