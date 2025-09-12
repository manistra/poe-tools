import { ItemData, LiveSearchWithSocket } from "src/shared/types";
import { fetchItemDetails } from "./itemDetails";
import { persistentStore } from "src/shared/store/sharedStore";
import { transformItemData } from "src/renderer/helpers/transformItemData";

export const processItems = async (
  itemIds: string[],
  ws: LiveSearchWithSocket,
  game: "poe" | "poe2"
) => {
  try {
    const itemDetails = await fetchItemDetails(itemIds, game);

    persistentStore.setResults(
      (itemDetails.data as ItemData[]).map(transformItemData)
    );

    return itemDetails;
  } catch (error) {
    console.error(error);
  }
};
