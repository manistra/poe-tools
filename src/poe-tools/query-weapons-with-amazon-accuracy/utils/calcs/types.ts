import { DamageWithoutRuneModsResult } from "./helpers/getDamageWithoutRuneMods";
import { RunePotentialDpsValues } from "./helpers/getPontentialDpsValuesForDifferentRunes";

export interface ItemData {
  id: string;
  time: string;
  item: {
    sockets: any;
    name: string;
    typeLine: string;
    properties: {
      name: string;
      values: [string, number][];
      displayMode: number;
      type?: number;
    }[];
    explicitMods?: string[];
    runeMods?: string[];
    fracturedMods?: string[];
    extended: {
      pdps: number;
      edps: number;
      dps: number;
    };
  };
  listing?: {
    indexed: any;
    account: {
      name: string;
    };
    price: {
      amount: number;
      currency: string;
    };
    whisper?: string;
  };
}

export interface CalculatedDamage {
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
}

export interface TransformedItemData {
  id: string;
  name: string;
  typeLine: string;
  time: string;
  listedAt: string;
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
  calculatedDamage: CalculatedDamage;
  calculatedDamageAmazonScaling: CalculatedDamage;
}
