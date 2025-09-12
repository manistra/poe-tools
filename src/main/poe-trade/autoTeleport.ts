import { persistentStore } from "src/shared/store/sharedStore";
import { apiNoLimiter } from "../api/apis";

const createHeaders = (poesessid: string) => {
  return {
    "Content-Type": "application/json",
    "User-Agent": "anything",
    Cookie: `POESESSID=${poesessid}`,
    Accept: "*/*",
    "Accept-Language": "en-GB,en;q=0.9",
    Connection: "keep-alive",
    Origin: "https://www.pathofexile.com",
    Referer: "https://www.pathofexile.com/trade",
    "X-Requested-With": "XMLHttpRequest",
    Host: "www.pathofexile.com",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
  };
};

export const poe2SearchUrl =
  "https://www.pathofexile.com/api/trade2/search/poe2/Dawn%20of%20the%20Hunt";

export interface WhisperRequest {
  itemId?: string;
  hideoutToken?: string;
  searchQueryId?: string;
}

export interface WhisperResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export const autoTeleport = async ({
  itemId,
  hideoutToken,
  searchQueryId,
}: WhisperRequest): Promise<WhisperResponse> => {
  try {
    console.log("autoTeleport", itemId, hideoutToken, searchQueryId);

    if (!itemId || !hideoutToken) {
      return {
        success: false,
        message: "Item ID and hideout token are required",
        error: "Item ID and hideout token are required",
      };
    }

    const url = "https://www.pathofexile.com/api/trade2/whisper";

    const requestBody = {
      item: itemId,
      token: hideoutToken,
      continue: true,
      ...(searchQueryId && { query: searchQueryId }),
    };

    const headers = createHeaders(persistentStore.getState().poeSessionid);

    const response = await apiNoLimiter({
      url,
      method: "POST",
      headers,
      data: requestBody,
    });

    return {
      success: !response.error,
      message: response.data?.message,
      error: response.error?.message,
    };
  } catch (error) {
    console.error("autoTeleport error", error);
    return {
      success: false,
      message: "Error sending whisper",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
