import { fetchItemDetails } from "./fetchItemDetails";
import { persistentStore } from "src/shared/store/sharedStore";
import { transformItemData } from "src/renderer/helpers/transformItemData";
import { autoTeleport } from "./autoTeleport";
import { sendWhisper } from "./sendWhisper";
import { TransformedItemData } from "src/shared/types";
import {
  playPingSound,
  playTeleportSound,
  playWhisperSound,
} from "../utils/soundUtils";

export const processItems = async (
  itemIds: string[],
  game: "poe" | "poe2",
  searchLabel?: string
) => {
  try {
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
      const transformedItems = [
        ...itemDetails.data.result.map((item) => {
          const rawItem = {
            ...item,
            searchLabel: searchLabel,
          };

          return transformItemData(rawItem);
        }),
      ];

      const itemToAutoBuy = { ...transformedItems[0] } as TransformedItemData;

      if (
        persistentStore.getState().autoWhisper &&
        itemToAutoBuy?.whisper_token &&
        itemToAutoBuy?.whisper_token !== ""
      ) {
        persistentStore.addLog(`[API] Auto Whisper Initiated - ${searchLabel}`);
        playWhisperSound();
        const whisperResponse = await sendWhisper({
          itemId: itemToAutoBuy?.id,
          token: itemToAutoBuy?.whisper_token,
          searchQueryId: itemToAutoBuy?.searchQueryId,
        });

        if (whisperResponse.success) {
          // Trigger success sound for whisper

          transformedItems.shift(); // Remove first element
          transformedItems.unshift({ ...itemToAutoBuy, isWhispered: true }); // Add itemToAutoBuy at beginning
        } else {
          persistentStore.addLog(`[API] Auto Whisper Failed - ${searchLabel}`);
          persistentStore.addLog(whisperResponse.error || "Unknown error");
        }
      }

      if (
        persistentStore.getState().autoTeleport &&
        !persistentStore.getState().isTeleportingBlocked &&
        itemToAutoBuy?.hideoutToken &&
        itemToAutoBuy?.hideoutToken !== ""
      ) {
        persistentStore.addLog(
          `[API] Auto Teleport Initiated - ${searchLabel}`
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
          playTeleportSound();
          transformedItems.shift(); // Remove first element
          transformedItems.unshift({ ...itemToAutoBuy, isWhispered: true }); // Add itemToAutoBuy at beginning
        } else {
          persistentStore.addLog(`[API] Auto Teleport Failed - ${searchLabel}`);
          persistentStore.addLog(autoTeleportResponse.error || "Unknown error");
        }
      }
      transformedItems.forEach((item) => {
        persistentStore.addResult(item);
      });

      if (
        !(
          persistentStore.getState().autoTeleport &&
          !persistentStore.getState().isTeleportingBlocked &&
          itemToAutoBuy?.hideoutToken &&
          itemToAutoBuy?.hideoutToken !== ""
        ) &&
        !(
          persistentStore.getState().autoWhisper &&
          itemToAutoBuy?.whisper_token &&
          itemToAutoBuy?.whisper_token !== ""
        )
      )
        playPingSound();
    } else {
      console.warn("API response data is not an array:", itemDetails?.data);
    }
  } catch (error) {
    persistentStore.addLog(`[API] Error processing items - ${searchLabel}`);
  }
};
