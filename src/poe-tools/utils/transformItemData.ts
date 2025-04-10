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
  elementalDamage: {
    fire?: string;
    cold?: string;
    lightning?: string;
  };
  totalAccuracy: number;
  pdps: number;
  edps: number;
  dps: number;
  dpsWithAccuracy: number;
  explicitMods?: string[];
  runeMods?: string[];
  fracturedMods?: string[];
  seller?: string;
  price?: {
    amount: number;
    currency: string;
  };
  whisper?: string;
}

/**
 * Transforms the raw API item data into a cleaner, typed structure
 * @param rawItem The raw item data from the API
 * @returns A transformed item object with direct access to commonly used properties
 */
export function transformItemData(rawItem: ItemData): TransformedItemData {
  // Find properties
  const attackSpeed = rawItem.item.properties.find(
    (property: any) => property.name === "Attacks per Second"
  );

  const physicalDamage = rawItem.item.properties.find(
    (property: any) => property.name === "[Physical] Damage"
  );

  const fireDamage = rawItem.item.properties.find(
    (property: any) => property.name === "[Fire] Damage"
  );

  const coldDamage = rawItem.item.properties.find(
    (property: any) => property.name === "[Cold] Damage"
  );

  const lightningDamage = rawItem.item.properties.find(
    (property: any) => property.name === "[Lightning] Damage"
  );

  const criticalChance = rawItem.item.properties.find(
    (property: any) => property.name === "[Critical|Critical Hit] Chance"
  );

  const elementalDamageFind = rawItem.item.properties.find(
    (property: any) => property.name === "[ElementalDamage|Elemental] Damage"
  );

  // Calculate total accuracy
  const totalAccuracy = calculateTotalAccuracy(rawItem.item);

  // Create transformed object
  const transformedItem: TransformedItemData = {
    id: rawItem.id || "",
    name: rawItem.item.name || "",
    typeLine: rawItem.item.typeLine || "",
    time: rawItem.time || new Date().toLocaleTimeString(),
    criticalChance: criticalChance?.values[0][0] || "0%",
    attacksPerSecond: attackSpeed?.values[0][0] || "0",
    physicalDamage: physicalDamage?.values[0][0] || "0-0",
    elementalDamage: {
      fire: elementalDamageFind?.values.find(
        (val: [string, number]) => val[1] === 4
      )?.[0],
      cold: elementalDamageFind?.values.find(
        (val: [string, number]) => val[1] === 5
      )?.[0],
      lightning: elementalDamageFind?.values.find(
        (val: [string, number]) => val[1] === 6
      )?.[0],
    },
    totalAccuracy,
    pdps: rawItem.item.extended.pdps || 0,
    edps: rawItem.item.extended.edps || 0,
    dps: rawItem.item.extended.dps || 0,
    dpsWithAccuracy: Math.round(
      (rawItem.item.extended.dps || 0) + totalAccuracy / 4
    ),
    explicitMods: rawItem.item.explicitMods || [],
    runeMods: rawItem.item.runeMods || [],
    fracturedMods: rawItem.item.fracturedMods || [],
    seller: rawItem.listing?.account?.name || "",
    price: rawItem.listing?.price
      ? {
          amount: rawItem.listing.price.amount || 0,
          currency: rawItem.listing.price.currency || "",
        }
      : undefined,
    whisper: rawItem.listing?.whisper,
  };

  // Add optional damage properties only if they exist
  if (fireDamage) {
    transformedItem.fireDamage = fireDamage.values[0][0];
  }

  if (coldDamage) {
    transformedItem.coldDamage = coldDamage.values[0][0];
  }

  if (lightningDamage) {
    transformedItem.lightningDamage = lightningDamage.values[0][0];
  }

  return transformedItem;
}
