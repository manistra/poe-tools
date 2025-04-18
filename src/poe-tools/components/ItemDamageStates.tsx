import React from "react";
import {
  CalculatedDamage,
  TransformedItemData,
} from "../query-weapons-with-amazon-accuracy/utils/calcs/types";
import DamageStat from "./DamageStat";
import CollapsibleItem from "src/components/CollapsibleItem";
import ItemMods from "./ItemMods";

interface ItemCalculatedDamageProps {
  item: TransformedItemData;
  calculatedDamage: CalculatedDamage;
  calculatedDamageAmazonScaling: CalculatedDamage;
  calculateForAmazonAscendancy?: boolean;
}

const ItemCalculatedDamage: React.FC<ItemCalculatedDamageProps> = ({
  item,
  calculatedDamage,
  calculatedDamageAmazonScaling,
  calculateForAmazonAscendancy,
}) => {
  const damageStats = calculateForAmazonAscendancy
    ? calculatedDamageAmazonScaling
    : calculatedDamage;

  return (
    <>
      <div className="flex flex-row gap-16 justify-between">
        <ItemMods item={item} />

        <div className="flex text-xs w-1/2 max-w-[350px] flex-col">
          <h2 className="text-gray-200 text-base ">Base Item Stats: </h2>

          <hr className="border-gray-700 my-1" />

          <DamageStat label="Crit Chance">{item.criticalChance}</DamageStat>
          <DamageStat label="Attacks per Second">
            {item.attacksPerSecond}
          </DamageStat>
          {(!!item.elementalDamage.cold ||
            !!item.elementalDamage.fire ||
            !!item.elementalDamage.lightning) && (
            <DamageStat label="Elemental Damage">
              <>
                <span className="text-red-500">
                  {item.elementalDamage.fire}
                </span>
                {"  "}
                <span className="text-blue-400">
                  {item.elementalDamage.cold}
                </span>
                {"  "}
                <span className="text-yellow-400">
                  {item.elementalDamage.lightning}
                </span>
              </>
            </DamageStat>
          )}
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
              <span className="text-yellow-400">{item.lightningDamage}</span>
            </DamageStat>
          )}

          <h2 className="text-gray-500 border-b text-xs mt-3 mb-1 border-gray-500">
            Base dps:
          </h2>
          <div className="px-2">
            <DamageStat label="pDPS">{calculatedDamage.pdps}</DamageStat>
            <DamageStat label="eDPS">{calculatedDamage.edps}</DamageStat>
            <DamageStat label="Total DPS">{calculatedDamage.dps}</DamageStat>
          </div>

          <h2 className="text-gray-500 border-b text-xs mt-3 mb-1 border-gray-500">
            No rune dps:{" "}
          </h2>

          <div className="px-2">
            <DamageStat label="pDPS">
              {calculatedDamage.totalDamageWithoutRuneMods.pdps}
            </DamageStat>
            <DamageStat label="eDPS">
              {calculatedDamage.totalDamageWithoutRuneMods.edps}
            </DamageStat>
            <DamageStat label="Total DPS">
              {calculatedDamage.totalDamageWithoutRuneMods.dps}
            </DamageStat>
          </div>
          {!!item.totalAccuracy && (
            <DamageStat
              label="Total Accuracy"
              className="text-base !text-blue-400 mt-3"
            >
              {item.totalAccuracy}
            </DamageStat>
          )}
        </div>
      </div>

      <CollapsibleItem title="Calculated DPS" className="mt-2">
        <div className="flex text-xs w-1/2 max-w-[350px] flex-col">
          <h2 className="text-gray-200 text-base ">Calculated DPS: </h2>

          <hr className="border-gray-700 my-1" />

          <DamageStat label="Damage Without Runes">
            {damageStats.totalDamageWithoutRuneMods.dps}
          </DamageStat>

          <DamageStat label="Physical Rune DPS">
            {damageStats.runePotentialDpsValues.potentialPhysRuneDps}
          </DamageStat>
          <DamageStat label="Elemental Rune DPS">
            {damageStats.runePotentialDpsValues.potentialEleRuneDps}
          </DamageStat>

          {!!calculateForAmazonAscendancy && (
            <DamageStat label="Accuracy Rune DPS">
              {damageStats.runePotentialDpsValues.potentialAccuracyRuneDps}
            </DamageStat>
          )}
          <DamageStat label="Attack Speed Rune DPS">
            {damageStats.runePotentialDpsValues.potentialAttackSpeedRuneDps}
          </DamageStat>

          <div className="mt-2">
            <label className="text-[10px] text-orange-700">
              Calculated higest overall highest DPS:{" "}
            </label>
            <h3 className="font-medium flex flex-row w-full justify-between text-white border px-2 py-1 my-1 rounded border-orange-700 pt-2 items-center">
              <span className="text-gray-200 ">
                With {damageStats.highestPotentialDpsValue?.numberOfRuneSockets}{" "}
                {damageStats.highestPotentialDpsValue?.name}
                {damageStats.highestPotentialDpsValue?.numberOfRuneSockets >
                  1 && "s"}
                :
              </span>
              <span className="text-base font-bold">
                {damageStats.highestPotentialDpsValue?.value}
              </span>
            </h3>
          </div>
        </div>
      </CollapsibleItem>
    </>
  );
};

export default ItemCalculatedDamage;
