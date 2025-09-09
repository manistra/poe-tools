// import { DamageWithoutRuneModsResult } from "./helpers/getDamageWithoutRuneMods";
// import { RunePotentialDpsValues } from "./helpers/getPontentialDpsValuesForDifferentRunes";

export interface ItemData {
  id: string;
  time: string;
  item: {
    sockets: unknown;
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
  pingedAt: string;
  listing?: {
    indexed: string;
    account: {
      name: string;
    };
    price: {
      amount: number;
      currency: string;
    };
    whisper?: string;
    hideout_token?: string;
  };
}

export interface TransformedItemData {
  pingedAt: string;
  id: string;
  name: string;
  typeLine: string;
  time: string;
  listedAt: string;
  explicitMods?: string[];
  runeMods?: string[];
  fracturedMods?: string[];
  seller?: string;
  price?: {
    amount: number;
    currency: string;
  };
  whisper?: string;
  hideoutToken?: string;
  searchQueryId?: string;
  corrupted?: boolean;
  runeSockets?: number;
}
