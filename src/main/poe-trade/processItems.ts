import { fetchItemDetails } from "./fetchItemDetails";
import { persistentStore } from "src/shared/store/sharedStore";
import { transformItemData } from "src/renderer/helpers/transformItemData";
import { autoTeleport } from "./autoTeleport";
import { sendWhisper } from "./sendWhisper";
import { LiveSearchDetails, TransformedItemData } from "src/shared/types";

import {
  playPingSound,
  playTeleportSound,
  playWhisperSound,
} from "../utils/soundUtils";

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
      const transformedItems = [
        ...itemDetails.data.result.map((item) => {
          const rawItem = {
            ...item,
            searchLabel: liveSearch?.label,
          };

          return transformItemData(rawItem, liveSearch);
        }),
      ];

      const itemToAutoBuy = { ...transformedItems[0] } as TransformedItemData;

      const doesPassCurrencyConditions =
        !itemToAutoBuy?.failingCurrencyCondition;

      if (
        doesPassCurrencyConditions &&
        persistentStore.getState().autoWhisper &&
        itemToAutoBuy?.whisper_token &&
        itemToAutoBuy?.whisper_token !== ""
      ) {
        persistentStore.addLog(
          `[API] Auto Whisper Initiated - ${liveSearch?.label}`
        );

        const whisperResponse = await sendWhisper({
          itemId: itemToAutoBuy?.id,
          token: itemToAutoBuy?.whisper_token,
          searchQueryId: itemToAutoBuy?.searchQueryId,
        });

        if (whisperResponse.success) {
          if (!persistentStore.getState().disableSounds) {
            playWhisperSound();
          }

          transformedItems.shift(); // Remove first element
          transformedItems.unshift({ ...itemToAutoBuy, isWhispered: true }); // Add itemToAutoBuy at beginning
        } else {
          persistentStore.addLog(
            `[API] Auto Whisper Failed - ${liveSearch?.label}`
          );
          persistentStore.addLog(whisperResponse.error || "Unknown error");
        }
      }

      if (
        doesPassCurrencyConditions &&
        persistentStore.getState().autoTeleport &&
        !persistentStore.getState().isTeleportingBlocked &&
        itemToAutoBuy?.hideoutToken &&
        itemToAutoBuy?.hideoutToken !== ""
      ) {
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
          // Trigger success sound for teleport
          if (!persistentStore.getState().disableSounds) {
            playTeleportSound();
          }
          transformedItems.shift(); // Remove first element
          transformedItems.unshift({ ...itemToAutoBuy, isWhispered: true }); // Add itemToAutoBuy at beginning
        } else {
          persistentStore.addLog(
            `[API] Auto Teleport Failed - ${liveSearch?.label}`
          );
          persistentStore.addLog(autoTeleportResponse.error || "Unknown error");
        }
      }
      transformedItems.forEach((item) => {
        // Check if item with this ID already exists in results
        const existingResults = persistentStore.getState().results;
        const itemExists = existingResults.some(
          (existingItem) => existingItem.id === item.id
        );

        if (!itemExists) {
          persistentStore.addResult(item);
        } else {
          persistentStore.addLog(
            `[API] Item ${item.id} already exists in results, skipping - ${liveSearch?.label}`
          );
        }
      });

      if (
        !(
          doesPassCurrencyConditions &&
          persistentStore.getState().autoTeleport &&
          !persistentStore.getState().isTeleportingBlocked &&
          itemToAutoBuy?.hideoutToken &&
          itemToAutoBuy?.hideoutToken !== ""
        ) &&
        !(
          doesPassCurrencyConditions &&
          persistentStore.getState().autoWhisper &&
          itemToAutoBuy?.whisper_token &&
          itemToAutoBuy?.whisper_token !== ""
        )
      ) {
        if (
          !persistentStore.getState().disableSounds &&
          doesPassCurrencyConditions
        ) {
          playPingSound();
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
