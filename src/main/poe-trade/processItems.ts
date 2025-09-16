import { fetchItemDetails } from "./fetchItemDetails";
import { persistentStore } from "src/shared/store/sharedStore";
import { transformItemData } from "src/renderer/helpers/transformItemData";
import { autoTeleport } from "./autoTeleport";
import { sendWhisper } from "./sendWhisper";
import { LiveSearchDetails, TransformedItemData } from "src/shared/types";
import { playSound } from "../utils/soundUtils";

export const processItems = async (
  itemIds: string[],
  game: "poe" | "poe2",
  liveSearch?: LiveSearchDetails
) => {
  try {
    if (!itemIds) {
      return;
    }

    persistentStore.addLog(
      `[API] Fetching ${itemIds.length} item details - ${liveSearch?.label}`
    );
    const itemDetails = await fetchItemDetails(itemIds, game);

    persistentStore.addLog(
      `[API] Received ${itemIds.length} item details - ${liveSearch?.label}`
    );

    if (itemDetails?.data && Array.isArray(itemDetails.data.result)) {
      // OPTIMIZATION 1: Cache store state to avoid multiple reads
      const storeState = persistentStore.getState();

      // OPTIMIZATION 2: Parallel data transformation using Promise.all
      const transformedItems = await Promise.all(
        itemDetails.data.result.map(async (item) => {
          const rawItem = {
            ...item,
            searchLabel: liveSearch?.label,
          };
          return transformItemData(rawItem, liveSearch);
        })
      );

      const itemToAutoBuy = transformedItems[0] as TransformedItemData;

      const doesPassCurrencyConditions =
        !itemToAutoBuy?.failingCurrencyCondition;

      const soundsEnabled = !storeState.disableSounds;

      const teleportCondition =
        doesPassCurrencyConditions &&
        storeState.autoTeleport &&
        !storeState.isTeleportingBlocked &&
        itemToAutoBuy?.hideoutToken &&
        itemToAutoBuy?.hideoutToken !== "";

      const whisperCondition =
        doesPassCurrencyConditions &&
        storeState.autoWhisper &&
        itemToAutoBuy?.whisper_token &&
        itemToAutoBuy?.whisper_token !== "";

      if (teleportCondition) {
        persistentStore.addLog(
          `[API] Auto Teleport Initiated - ${liveSearch?.label}`
        );

        persistentStore.setLastTeleportedItem(itemToAutoBuy ?? null);
        persistentStore.setIsTeleportingBlocked(true);

        const autoTeleportResponse = await autoTeleport({
          itemId: itemToAutoBuy?.id,
          hideoutToken: itemToAutoBuy?.hideoutToken,
          searchQueryId: itemToAutoBuy?.searchQueryId,
        });

        if (autoTeleportResponse.success) {
          const teleportSound = storeState.selectedSounds?.teleport;
          if (soundsEnabled && teleportSound !== "none") {
            playSound(teleportSound);
          }

          // OPTIMIZATION 3: More efficient array manipulation
          transformedItems[0] = { ...itemToAutoBuy, isWhispered: true };
        } else {
          persistentStore.addLog(
            `[API] Auto Teleport Failed - ${liveSearch?.label}`
          );
          persistentStore.addLog(autoTeleportResponse.error || "Unknown error");
        }
      } else if (whisperCondition) {
        persistentStore.addLog(
          `[API] Auto Whisper Initiated - ${liveSearch?.label}`
        );

        const whisperResponse = await sendWhisper({
          itemId: itemToAutoBuy?.id,
          token: itemToAutoBuy?.whisper_token,
          searchQueryId: itemToAutoBuy?.searchQueryId,
        });

        if (whisperResponse.success) {
          const whisperSound = storeState.selectedSounds?.whisper;
          if (soundsEnabled && whisperSound !== "none") {
            playSound(whisperSound);
          }

          // OPTIMIZATION 3: More efficient array manipulation
          transformedItems[0] = { ...itemToAutoBuy, isWhispered: true };
        } else {
          persistentStore.addLog(
            `[API] Auto Whisper Failed - ${liveSearch?.label}`
          );
          persistentStore.addLog(whisperResponse.error || "Unknown error");
        }
      }

      // OPTIMIZATION 4: Batch process results to avoid multiple store operations
      const existingResults = storeState.results;
      const newResults = transformedItems.filter(
        (item) =>
          !existingResults.some((existingItem) => existingItem.id === item.id)
      );

      if (newResults.length > 0) {
        newResults.forEach((item) => persistentStore.addResult(item));
      } else {
        persistentStore.addLog(
          `[API] All items already exist in results, skipping - ${liveSearch?.label}`
        );
      }

      if (
        !teleportCondition &&
        !whisperCondition &&
        doesPassCurrencyConditions
      ) {
        const pingSound = storeState.selectedSounds?.ping;
        if (soundsEnabled && pingSound !== "none") {
          playSound(pingSound);
        }
      }
    } else {
      console.warn("API response data is not an array:", itemDetails?.data);
    }
  } catch (error) {
    persistentStore.addLog(
      `[API] Error processing items - ${liveSearch?.label}`
    );
  }
};
