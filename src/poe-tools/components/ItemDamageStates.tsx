import React from "react";
import {
  CalculatedDamage,
  TransformedItemData,
} from "../query-weapons-with-amazon-accuracy/utils/calcs/types";
import DamageStat from "./DamageStat";

interface ItemCalculatedDamageProps {
  item: TransformedItemData;
  calculatedDamage: CalculatedDamage;
  calculateForAmazonAscendancy?: boolean;
  totalDpsNoAmazonScaling: number;
  totalDpsNoAmazonScalingLabel: string;
}

const ItemCalculatedDamage: React.FC<ItemCalculatedDamageProps> = ({
  item,
  calculatedDamage,
  calculateForAmazonAscendancy,
  totalDpsNoAmazonScaling,
  totalDpsNoAmazonScalingLabel,
}) => {
  return (
    <div className="flex flex-row gap-16 justify-between">
      <div className="flex text-xs w-1/2 max-w-[350px] flex-col">
        <h2 className="text-gray-200 text-base ">Calculated DPS: </h2>

        <hr className="border-gray-700 my-1" />

        <DamageStat label="Damage Without Runes">
          {calculatedDamage.totalDamageWithoutRuneMods.dps}
        </DamageStat>

        <DamageStat label="Physical Rune DPS">
          {calculatedDamage.runePotentialDpsValues.potentialPhysRuneDps}
        </DamageStat>
        <DamageStat label="Elemental Rune DPS">
          {calculatedDamage.runePotentialDpsValues.potentialEleRuneDps}
        </DamageStat>

        {!!calculateForAmazonAscendancy && (
          <DamageStat label="Accuracy Rune DPS">
            {calculatedDamage.runePotentialDpsValues.potentialAccuracyRuneDps}
          </DamageStat>
        )}
        <DamageStat label="Attack Speed Rune DPS">
          {calculatedDamage.runePotentialDpsValues.potentialAttackSpeedRuneDps}
        </DamageStat>

        <div className="mt-2">
          <label className="text-[10px] text-orange-700">
            Calculated higest overall highest DPS:{" "}
          </label>
          <h3 className="font-medium flex flex-row w-full justify-between text-white border px-2 py-1 my-1 rounded border-orange-700 pt-2 items-center">
            <span className="text-gray-200 ">
              With{" "}
              {calculatedDamage.highestPotentialDpsValue?.numberOfRuneSockets}{" "}
              {calculatedDamage.highestPotentialDpsValue?.name}
              {calculatedDamage.highestPotentialDpsValue?.numberOfRuneSockets >
                1 && "s"}
              :
            </span>
            <span className="text-base font-bold">
              {calculatedDamage.highestPotentialDpsValue?.value}
            </span>
          </h3>
        </div>
      </div>

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
              <span className="text-red-500">{item.elementalDamage.fire}</span>
              {"  "}
              <span className="text-blue-400">{item.elementalDamage.cold}</span>
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

        <DamageStat label="pDPS">{calculatedDamage.pdps}</DamageStat>
        <DamageStat label="eDPS">{calculatedDamage.edps}</DamageStat>
        <DamageStat label="Total DPS">{calculatedDamage.dps}</DamageStat>

        <div className="py-2 mt-3 border-y">
          <DamageStat
            className="text-base !text-gray-400"
            label={`pDPS (${totalDpsNoAmazonScalingLabel}):`}
          >
            {(
              (calculatedDamage.totalDamageWithoutRuneMods.pdps /
                (1 + (item.increasedPhysicalDamage || 0.001) / 100)) *
              (1 + (25 + item.increasedPhysicalDamage || 0.001) / 100)
            ).toFixed(2)}
          </DamageStat>

          {!!item.totalAccuracy && (
            <DamageStat
              label="Total Accuracy"
              className="text-base !text-blue-400"
            >
              {item.totalAccuracy}
            </DamageStat>
          )}

          <DamageStat
            className="text-base !text-blue-400"
            label={`Total DPS Raw (${totalDpsNoAmazonScalingLabel}):`}
          >
            {totalDpsNoAmazonScaling}
          </DamageStat>
        </div>
      </div>
    </div>
  );
};

export default ItemCalculatedDamage;
