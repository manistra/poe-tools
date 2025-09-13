import { persistentStore } from "src/shared/store/sharedStore";
import { rateLimitedApi } from "../api/apis";

const createHeaders = (poesessid: string) => {
  return {
    "Content-Type": "application/json",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Safari/605.1.15",
    Cookie: `POESESSID=${poesessid}`,
    Accept: "*/*",
    "Accept-Language": "en-GB,en;q=0.9",
    Connection: "keep-alive",
    Origin: "https://www.pathofexile.com",
    Referer:
      "https://www.pathofexile.com/trade2/search/poe2/Rise%20of%20the%20Abyssal/2KewQXooUk",
    "X-Requested-With": "XMLHttpRequest",
    Host: "www.pathofexile.com",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
  };
};

export interface WhisperRequest {
  itemId?: string;
  token?: string;
  searchQueryId?: string;
}

export interface WhisperResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export const sendWhisper = async ({
  itemId,
  token,
  searchQueryId,
}: WhisperRequest): Promise<WhisperResponse> => {
  try {
    console.log("sendWhisper", itemId, token, searchQueryId);

    if (!itemId || !token) {
      return {
        success: false,
        message: "Item ID and token are required",
        error: "Item ID and token are required",
      };
    }

    const url = "https://www.pathofexile.com/api/trade2/whisper";

    const requestBody = {
      item: itemId,
      token: token,
      continue: true,
      ...(searchQueryId && { query: searchQueryId }),
    };

    const headers = createHeaders(persistentStore.getState().poeSessionid);

    const response = await rateLimitedApi({
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
    console.error("sendWhisper error", error);
    return {
      success: false,
      message: "Error sending whisper",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
