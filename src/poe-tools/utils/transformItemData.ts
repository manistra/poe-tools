import { calculateTotalAccuracy } from "./calculateAccuracy";
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

export interface ItemData {
  id: string;
  time: string;
  item: {
    sockets: any;
    name: string;
    typeLine: string;
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
interface DamageWithoutRuneModsResult {
  pdps: number;
  edps: number;
  dps: number;
}
interface RunePotentialDpsValues {
  potentialPhysRuneDps: number;
  potentialEleRuneDps: number;
  potentialAccuracyRuneDps: number;
  potentialAttackSpeedRuneDps: number;
}
export interface TransformedItemData {
  id: string;
  name: string;
  typeLine: string;
  time: string;
  criticalChance: string;
  attacksPerSecond: string;
  physicalDamage: string;
  fireDamage?: string;
  coldDamage?: string;
  lightningDamage?: string;
  increasedPhysicalDamage?: number;

  elementalDamage: {
    fire?: string;
    cold?: string;
    lightning?: string;
  };
  totalAccuracy: number;
  explicitMods?: string[];
  runeMods?: string[];
  fracturedMods?: string[];
  seller?: string;
  price?: {
    amount: number;
    currency: string;
  };
  whisper?: string;
  calculatedDamage: {
    highestPotentialDpsValue: {
      value: number;
      numberOfRuneSockets: number;
      name: string;
    };
    pdps: number;
    edps: number;
    dps: number;
    totalDamageWithoutRuneMods: DamageWithoutRuneModsResult;
    runePotentialDpsValues: RunePotentialDpsValues;
  };
}

const getDamageWithoutRuneMods = ({
  pdps,
  edps,
  runeMods,
  increasedPhysicalDamage,
  attackSpeed,
}: {
  pdps: number;
  edps: number;
  runeMods: string[];
  increasedPhysicalDamage: number;
  attackSpeed: number;
}) => {
  let pdpsWithoutRuneMods = pdps;
  let edpsWithoutRuneMods = edps;

  runeMods?.map((mod) => {
    if (mod.includes("increased [Physical] Damage")) {
      const matches = mod.match(/(\d+)% increased \[Physical\] Damage/);
      if (matches && matches[1]) {
        const runeIncreasedPhysicalDamage = parseInt(matches[1]);

        const pdpsWithoutIncreasedPhysicalDamage =
          pdpsWithoutRuneMods /
          (1 + (increasedPhysicalDamage + runeIncreasedPhysicalDamage) / 100);

        pdpsWithoutRuneMods =
          pdpsWithoutIncreasedPhysicalDamage *
          (1 + increasedPhysicalDamage / 100);
      }
    } else if (mod.includes("Adds") && mod.includes("[Fire|Fire] Damage")) {
      const matches = mod.match(/Adds (\d+) to (\d+) \[Fire\|Fire\] Damage/);
      if (matches && matches[1] && matches[2]) {
        const minDamage = parseInt(matches[1]);
        const maxDamage = parseInt(matches[2]);
        const avgDamage = (minDamage + maxDamage) / 2;
        edpsWithoutRuneMods -= avgDamage * attackSpeed;
      }
    } else if (mod.includes("Adds") && mod.includes("[Cold|Cold] Damage")) {
      const matches = mod.match(/Adds (\d+) to (\d+) \[Cold\|Cold\] Damage/);
      if (matches && matches[1] && matches[2]) {
        const minDamage = parseInt(matches[1]);
        const maxDamage = parseInt(matches[2]);
        const avgDamage = (minDamage + maxDamage) / 2;
        edpsWithoutRuneMods -= avgDamage * attackSpeed;
      }
    } else if (
      mod.includes("Adds") &&
      mod.includes("[Lightning|Lightning] Damage")
    ) {
      const matches = mod.match(
        /Adds (\d+) to (\d+) \[Lightning\|Lightning\] Damage/
      );
      if (matches && matches[1] && matches[2]) {
        const minDamage = parseInt(matches[1]);
        const maxDamage = parseInt(matches[2]);
        const avgDamage = (minDamage + maxDamage) / 2;
        edpsWithoutRuneMods -= avgDamage * attackSpeed;
      }
    } else if (mod.includes("increased [Attack] Speed")) {
      const matches = mod.match(/(\d+)% increased \[Attack\] Speed/);
      if (matches && matches[1]) {
        const runeIcreasedAttackSpeed = parseInt(matches[1]);

        pdpsWithoutRuneMods = pdpsWithoutRuneMods / attackSpeed;
        pdpsWithoutRuneMods =
          pdpsWithoutRuneMods *
          (attackSpeed * (1 + runeIcreasedAttackSpeed / 100));

        edpsWithoutRuneMods = edpsWithoutRuneMods / attackSpeed;
        edpsWithoutRuneMods =
          edpsWithoutRuneMods *
          (attackSpeed * (1 + runeIcreasedAttackSpeed / 100));
      }
    }
  });

  return {
    pdps: parseFloat(pdpsWithoutRuneMods.toFixed(2)),
    edps: parseFloat(edpsWithoutRuneMods.toFixed(2)),
    dps: parseFloat((pdpsWithoutRuneMods + edpsWithoutRuneMods).toFixed(2)),
  } as DamageWithoutRuneModsResult;
};

const getPontentialDpsValuesForDifferentRunes = (
  numberOfRuneSockets: number,
  increasedPhysicalDamage: number,
  attackSpeed: number,
  totalDamageWithoutRuneMods: DamageWithoutRuneModsResult,
  calculateForAmazonAscendancy: boolean,
  totalAccuracy: number
) => {
  // Phys Rune
  const pdpsWithoutIncreasedPhysicalDamage =
    totalDamageWithoutRuneMods.pdps / (1 + increasedPhysicalDamage / 100);

  const potentialPhysRuneDps =
    pdpsWithoutIncreasedPhysicalDamage *
      (1 + (increasedPhysicalDamage + 25 * numberOfRuneSockets) / 100) +
    totalDamageWithoutRuneMods.edps;

  const potentialEleRuneDps =
    totalDamageWithoutRuneMods.dps + numberOfRuneSockets * (15.5 * attackSpeed);

  const potentialAccuracyRuneDps =
    totalDamageWithoutRuneMods.dps + numberOfRuneSockets * (110 / 4);

  const potentialAttackSpeedRuneDps =
    (totalDamageWithoutRuneMods.dps / attackSpeed) *
    (attackSpeed * (1 + (numberOfRuneSockets * 5) / 100));
  return {
    potentialPhysRuneDps: parseFloat(
      (
        potentialPhysRuneDps +
        (calculateForAmazonAscendancy ? totalAccuracy / 4 : 0)
      ).toFixed(2)
    ),
    potentialEleRuneDps: parseFloat(
      (
        potentialEleRuneDps +
        (calculateForAmazonAscendancy ? totalAccuracy / 4 : 0)
      ).toFixed(2)
    ),
    potentialAccuracyRuneDps: parseFloat(
      (
        potentialAccuracyRuneDps +
        (calculateForAmazonAscendancy ? totalAccuracy / 4 : 0)
      ).toFixed(2)
    ),
    potentialAttackSpeedRuneDps: parseFloat(
      (
        potentialAttackSpeedRuneDps +
        (calculateForAmazonAscendancy ? totalAccuracy / 4 : 0)
      ).toFixed(2)
    ),
  } as RunePotentialDpsValues;
};

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
    calculateForAmazonAscendancy,
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

    calculatedDamage: {
      highestPotentialDpsValue: findHighestPotentialDpsValue({
        runePotentialDpsValues: runePotentialDpsValues,

        numberOfRuneSockets:
          rawItem?.item?.sockets?.length > 0
            ? rawItem?.item?.sockets?.length
            : 1,
        amazon: calculateForAmazonAscendancy,
      }),
      pdps: rawItem?.item?.extended?.pdps || 0,
      edps: rawItem?.item?.extended?.edps || 0,
      dps: rawItem?.item?.extended?.dps || 0,
      totalDamageWithoutRuneMods: totalDamageWithoutRuneMods,
      runePotentialDpsValues: runePotentialDpsValues,
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
