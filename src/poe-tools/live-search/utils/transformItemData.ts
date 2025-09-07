import { ItemData, TransformedItemData } from "./types";

export function transformItemData(rawItem: ItemData): TransformedItemData {
  const transformedItem: TransformedItemData = {
    pingedAt: rawItem?.pingedAt || new Date().toISOString(),

    id: rawItem?.id || "",
    name: rawItem?.item?.name || "",
    typeLine: rawItem?.item?.typeLine || "",
    time: rawItem?.time || new Date().toLocaleTimeString(),
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
    hideoutToken: rawItem?.listing?.hideout_token,
    searchLabel: rawItem?.searchLabel,
    listedAt: rawItem?.listing?.indexed,
  };

  return transformedItem;
}
