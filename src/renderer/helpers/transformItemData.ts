import { getFailingCurrencyCondition } from "src/shared/utils/getFailingCurrencyCondition";
import {
  ItemData,
  LiveSearchDetails,
  Poe2Currency,
  TransformedItemData,
} from "../../shared/types";

export function transformItemData(
  rawItem: ItemData,
  liveSearcDetails?: LiveSearchDetails
): TransformedItemData {
  const transformedItem: TransformedItemData = {
    pingedAt: rawItem?.pingedAt || new Date().toISOString(),

    id: rawItem?.id || "",
    name: rawItem?.item?.name || "",
    typeLine: rawItem?.item?.typeLine || "",
    rarity: rawItem?.item?.rarity || "",
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
          currency:
            (rawItem?.listing?.price?.currency as Poe2Currency) ||
            ("" as Poe2Currency),
        }
      : undefined,
    isWhispered: false,
    whisper: rawItem?.listing?.whisper,
    whisper_token: rawItem?.listing?.whisper_token,
    hideoutToken: rawItem?.listing?.hideout_token,
    searchLabel: rawItem?.searchLabel,
    listedAt: rawItem?.listing?.indexed,
    icon: rawItem?.item.icon,
    stash: {
      x: rawItem?.listing?.stash?.x,
      y: rawItem?.listing?.stash?.y,
    },

    failingCurrencyCondition: getFailingCurrencyCondition(
      rawItem,
      liveSearcDetails?.currencyConditions || []
    ),
  };

  return transformedItem;
}
