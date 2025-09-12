import { fetchItemDetails } from "./itemDetails";
import { persistentStore } from "src/shared/store/sharedStore";
import { transformItemData } from "src/renderer/helpers/transformItemData";

export const processItems = async (itemIds: string[], game: "poe" | "poe2") => {
  try {
    if (!itemIds) {
      return;
    }

    const itemDetails = await fetchItemDetails(itemIds, game);

    if (itemDetails?.data && Array.isArray(itemDetails.data.result)) {
      itemDetails.data.result.map((item) =>
        persistentStore.addResult(transformItemData(item))
      );
    } else {
      console.warn("API response data is not an array:", itemDetails?.data);
    }
  } catch (error) {
    console.error(error);
  }
};
