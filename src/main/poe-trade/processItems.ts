import { fetchItemDetails } from "./fetchItemDetails";
import { persistentStore } from "src/shared/store/sharedStore";
import { transformItemData } from "src/renderer/helpers/transformItemData";
import { autoTeleport } from "./autoTeleport";

export const processItems = async (
  itemIds: string[],
  game: "poe" | "poe2",
  searchLabel?: string
) => {
  try {
    const autoTeleportEnabled =
      persistentStore.getState().autoTeleport &&
      !persistentStore.getState().isTeleportingBlocked;

    if (!itemIds) {
      return;
    }
    persistentStore.addLog(
      `[API] Fetching ${itemIds.length} item details - ${searchLabel}`
    );
    const itemDetails = await fetchItemDetails(itemIds, game);

    persistentStore.addLog(
      `[API] Received ${itemIds.length} item details - ${searchLabel}`
    );

    if (itemDetails?.data && Array.isArray(itemDetails.data.result)) {
      const transformedItems = itemDetails.data.result.map((item) => {
        const rawItem = {
          ...item,
          searchLabel: searchLabel,
        };

        return transformItemData(rawItem);
      });

      if (autoTeleportEnabled) {
        const itemToTeleportTo = transformedItems[0];

        persistentStore.addLog(
          `[API] Auto Teleport Initiated - ${searchLabel}`
        );

        persistentStore.setLastTeleportedItem(itemToTeleportTo);

        await autoTeleport({
          itemId: itemToTeleportTo?.id,
          hideoutToken: itemToTeleportTo?.hideoutToken,
          searchQueryId: itemToTeleportTo?.searchQueryId,
        });

        persistentStore.setIsTeleportingBlocked(true);
      }

      transformedItems.forEach((item) => {
        persistentStore.addResult(item);
      });
    } else {
      console.warn("API response data is not an array:", itemDetails?.data);
    }
  } catch (error) {
    console.error(error);
  }
};
