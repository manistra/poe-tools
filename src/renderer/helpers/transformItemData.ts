import { ItemData, TransformedItemData } from "../types/types";

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
    corrupted: rawItem?.item?.corrupted,
    runeSockets: Array.isArray(rawItem?.item?.sockets)
      ? rawItem.item.sockets.length
      : 0,
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
    icon: rawItem?.item.icon,
    stash: { x: rawItem?.listing?.stash?.x, y: rawItem?.listing?.stash?.y },
  };

  return transformedItem;
}
