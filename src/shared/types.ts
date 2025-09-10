export interface SearchConfig {
  id: string;
  label: string;
  url: string;
  isActive: boolean;
}

export interface ItemData {
  id: string;
  time: string;
  item: {
    icon?: string;
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
    corrupted?: boolean;
    extended: {
      pdps: number;
      edps: number;
      dps: number;
    };
  };
  pingedAt: string;
  searchLabel?: string;
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
    stash?: {
      x: number;
      y: number;
    };
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
  corrupted?: boolean;
  runeSockets?: number;
  seller?: string;
  price?: {
    amount: number;
    currency: string;
  };
  whisper?: string;
  hideoutToken?: string;
  searchQueryId?: string;
  searchLabel?: string;

  stash?: {
    x: number;
    y: number;
  };
  icon?: string;
}
