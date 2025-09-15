import { fetchItemDetails } from "./fetchItemDetails";
import { persistentStore } from "src/shared/store/sharedStore";
import { transformItemData } from "src/renderer/helpers/transformItemData";
import { autoTeleport } from "./autoTeleport";
import { sendWhisper } from "./sendWhisper";
import {
  LiveSearchDetails,
  SoundType,
  TransformedItemData,
} from "src/shared/types";
import { playSound } from "../utils/soundUtils";
import { showOverlayWindow, hideOverlayWindow } from "../overlay/gridOverlay";

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

      const soundsEnabled = !persistentStore.getState().disableSounds;

      const teleportCondition =
        doesPassCurrencyConditions &&
        persistentStore.getState().autoTeleport &&
        !persistentStore.getState().isTeleportingBlocked &&
        itemToAutoBuy?.hideoutToken &&
        itemToAutoBuy?.hideoutToken !== "";

      const whisperCondition =
        doesPassCurrencyConditions &&
        persistentStore.getState().autoWhisper &&
        itemToAutoBuy?.whisper_token &&
        itemToAutoBuy?.whisper_token !== "";

      if (whisperCondition) {
        persistentStore.addLog(
          `[API] Auto Whisper Initiated - ${liveSearch?.label}`
        );

        const whisperResponse = await sendWhisper({
          itemId: itemToAutoBuy?.id,
          token: itemToAutoBuy?.whisper_token,
          searchQueryId: itemToAutoBuy?.searchQueryId,
        });

        if (whisperResponse.success) {
          const whisperSound =
            persistentStore.getState().selectedSounds?.whisper;
          if (soundsEnabled && whisperSound !== "none") {
            playSound(whisperSound);
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

      if (teleportCondition) {
        persistentStore.addLog(
          `[API] Auto Teleport Initiated - ${liveSearch?.label}`
        );

        // Show grid overlay with stash coordinates (if enabled)
        const gridConfig = persistentStore.getState().gridConfig;
        if (
          itemToAutoBuy?.stash?.x !== undefined &&
          itemToAutoBuy?.stash?.y !== undefined &&
          gridConfig.enabled
        ) {
          persistentStore.addLog(
            `[GRID] Showing grid overlay at stash position (${itemToAutoBuy.stash.x}, ${itemToAutoBuy.stash.y})`
          );

          // Show the grid overlay with highlight coordinates
          showOverlayWindow(itemToAutoBuy.stash.x, itemToAutoBuy.stash.y);
        } else if (
          itemToAutoBuy?.stash?.x !== undefined &&
          itemToAutoBuy?.stash?.y !== undefined &&
          !gridConfig.enabled
        ) {
          persistentStore.addLog(
            `[GRID] Grid overlay is disabled, skipping display for stash position (${itemToAutoBuy.stash.x}, ${itemToAutoBuy.stash.y})`
          );
        }

        persistentStore.setLastTeleportedItem(itemToAutoBuy ?? null);
        persistentStore.setIsTeleportingBlocked(true);

        const autoTeleportResponse = await autoTeleport({
          itemId: itemToAutoBuy?.id,
          hideoutToken: itemToAutoBuy?.hideoutToken,
          searchQueryId: itemToAutoBuy?.searchQueryId,
        });

        if (autoTeleportResponse.success) {
          // Trigger success sound for teleport

          const teleportSound =
            persistentStore.getState().selectedSounds?.teleport;
          if (soundsEnabled && teleportSound !== "none") {
            playSound(teleportSound);
          }

          transformedItems.shift(); // Remove first element
          transformedItems.unshift({ ...itemToAutoBuy, isWhispered: true }); // Add itemToAutoBuy at beginning
        } else {
          // Hide grid overlay
          hideOverlayWindow();
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
        !teleportCondition &&
        !whisperCondition &&
        doesPassCurrencyConditions
      ) {
        const pingSound = persistentStore.getState().selectedSounds?.ping;
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
