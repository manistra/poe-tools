/* eslint-disable @typescript-eslint/no-explicit-any */
import { calculateTotalAccuracy } from "./helpers/calculateAccuracy";
import { getDamageWithoutRuneMods } from "./helpers/getDamageWithoutRuneMods";
import {
  RunePotentialDpsValues,
  getPontentialDpsValuesForDifferentRunes,
} from "./helpers/getPontentialDpsValuesForDifferentRunes";
import { ItemData, TransformedItemData } from "./types";

const findHighestPotentialDpsValue = ({
  runePotentialDpsValues,

  amazon = false,
  numberOfRuneSockets,
}: {
  runePotentialDpsValues: RunePotentialDpsValues;
  numberOfRuneSockets: number;

  amazon?: boolean;
}) => {
  // Find the highest potential DPS value among all rune types
  const potentialDpsValues = [
    {
      value: runePotentialDpsValues.potentialPhysRuneDps,
      name: "Physical Rune",
      numberOfRuneSockets,
    },
    {
      value: runePotentialDpsValues.potentialEleRuneDps,
      name: "Elemental Rune",
      numberOfRuneSockets,
    },

    {
      value: runePotentialDpsValues.potentialAttackSpeedRuneDps,
      name: "Attack Speed Rune",
      numberOfRuneSockets,
    },
  ];
  if (amazon) {
    potentialDpsValues.push({
      value: runePotentialDpsValues.potentialAccuracyRuneDps,
      name: "Accuracy Rune",
      numberOfRuneSockets,
    });
  }

  // Sort by value in descending order and take the first (highest) one
  return potentialDpsValues.sort((a, b) => b.value - a.value)[0];
};
// };
/**
 * Transforms the raw API item data into a cleaner, typed structure
 * @param rawItem The raw item data from the API
 * @returns A transformed item object with direct access to commonly used properties
 */
export function transformItemData(
  rawItem: ItemData,
  calculateForAmazonAscendancy = false
): TransformedItemData {
  // Find properties
  const attackSpeed = rawItem?.item?.properties?.find(
    (property: any) => property?.name === "Attacks per Second"
  );
  const physicalDamage = rawItem?.item?.properties?.find(
    (property: any) => property?.name === "[Physical] Damage"
  );
  const fireDamage = rawItem?.item?.properties?.find(
    (property: any) => property?.name === "[Fire] Damage"
  );
  const coldDamage = rawItem?.item?.properties?.find(
    (property: any) => property?.name === "[Cold] Damage"
  );
  const lightningDamage = rawItem?.item?.properties?.find(
    (property: any) => property?.name === "[Lightning] Damage"
  );
  const criticalChance = rawItem?.item?.properties?.find(
    (property: any) => property?.name === "[Critical|Critical Hit] Chance"
  );
  const elementalDamageFind = rawItem?.item?.properties?.find(
    (property: any) => property?.name === "[ElementalDamage|Elemental] Damage"
  );
  const increasedPhysicalDamage = rawItem?.item?.explicitMods
    ?.find((mod: string) => mod?.includes("increased [Physical] Damage"))
    ?.match(/(\d+)%/)?.[1]
    ? parseInt(
        rawItem?.item?.explicitMods
          ?.find((mod: string) => mod?.includes("increased [Physical] Damage"))
          ?.match(/(\d+)%/)?.[1]
      )
    : undefined;

  const totalDamageWithoutRuneMods = getDamageWithoutRuneMods({
    pdps: Number(rawItem?.item?.extended?.pdps),
    edps: Number(rawItem?.item?.extended?.edps),
    runeMods: rawItem?.item?.runeMods,
    increasedPhysicalDamage: Number(increasedPhysicalDamage),
    attackSpeed: Number(attackSpeed?.values?.[0]?.[0]) || Number("0"),
  });

  // Calculate total accuracy
  const totalAccuracy = calculateTotalAccuracy(rawItem?.item);

  const runePotentialDpsValues = getPontentialDpsValuesForDifferentRunes(
    rawItem?.item?.sockets?.length > 0 ? rawItem?.item?.sockets?.length : 1,
    increasedPhysicalDamage || 0,
    Number(attackSpeed?.values?.[0]?.[0]) || 1,
    totalDamageWithoutRuneMods,
    false,
    totalAccuracy
  );
  const runePotentialDpsValuesAmazonScaling =
    getPontentialDpsValuesForDifferentRunes(
      rawItem?.item?.sockets?.length > 0 ? rawItem?.item?.sockets?.length : 1,
      increasedPhysicalDamage || 0,
      Number(attackSpeed?.values?.[0]?.[0]) || 1,
      totalDamageWithoutRuneMods,
      true,
      totalAccuracy
    );
  // Create transformed object
  const transformedItem: TransformedItemData = {
    id: rawItem?.id || "",
    name: rawItem?.item?.name || "",
    typeLine: rawItem?.item?.typeLine || "",
    time: rawItem?.time || new Date().toLocaleTimeString(),

    increasedPhysicalDamage: increasedPhysicalDamage || 0,
    criticalChance: criticalChance?.values?.[0]?.[0] || "0%",
    attacksPerSecond: attackSpeed?.values?.[0]?.[0] || "0",
    physicalDamage: physicalDamage?.values?.[0]?.[0] || "0-0",
    elementalDamage: {
      fire: elementalDamageFind?.values?.find(
        (val: [string, number]) => val?.[1] === 4
      )?.[0],
      cold: elementalDamageFind?.values?.find(
        (val: [string, number]) => val?.[1] === 5
      )?.[0],
      lightning: elementalDamageFind?.values?.find(
        (val: [string, number]) => val?.[1] === 6
      )?.[0],
    },
    totalAccuracy,
    explicitMods: rawItem?.item?.explicitMods || [],
    runeMods: rawItem?.item?.runeMods || [],
    fracturedMods: rawItem?.item?.fracturedMods || [],
    seller: rawItem?.listing?.account?.name || "",
    price: rawItem?.listing?.price
      ? {
          amount: rawItem?.listing?.price?.amount || 0,
          currency: rawItem?.listing?.price?.currency || "",
        }
      : undefined,
    whisper: rawItem?.listing?.whisper,
    listedAt: rawItem?.listing?.indexed,
    calculatedDamage: {
      highestPotentialDpsValue: findHighestPotentialDpsValue({
        runePotentialDpsValues: runePotentialDpsValues,

        numberOfRuneSockets:
          rawItem?.item?.sockets?.length > 0
            ? rawItem?.item?.sockets?.length
            : 1,
        amazon: false,
      }),
      pdps: rawItem?.item?.extended?.pdps || 0,
      edps: rawItem?.item?.extended?.edps || 0,
      dps: rawItem?.item?.extended?.dps || 0,
      totalDamageWithoutRuneMods: totalDamageWithoutRuneMods,
      runePotentialDpsValues: runePotentialDpsValues,
    },
    calculatedDamageAmazonScaling: {
      highestPotentialDpsValue: findHighestPotentialDpsValue({
        runePotentialDpsValues: runePotentialDpsValuesAmazonScaling,

        numberOfRuneSockets:
          rawItem?.item?.sockets?.length > 0
            ? rawItem?.item?.sockets?.length
            : 1,
        amazon: true,
      }),
      pdps: rawItem?.item?.extended?.pdps || 0,
      edps: rawItem?.item?.extended?.edps || 0,
      dps: rawItem?.item?.extended?.dps || 0,
      totalDamageWithoutRuneMods: totalDamageWithoutRuneMods,
      runePotentialDpsValues: runePotentialDpsValuesAmazonScaling,
    },
  };

  // Add optional damage properties only if they exist
  if (fireDamage) {
    transformedItem.fireDamage = fireDamage.values?.[0]?.[0];
  }

  if (coldDamage) {
    transformedItem.coldDamage = coldDamage.values?.[0]?.[0];
  }

  if (lightningDamage) {
    transformedItem.lightningDamage = lightningDamage.values?.[0]?.[0];
  }

  return transformedItem;
}
