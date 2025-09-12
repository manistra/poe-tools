import { getPoeSessionId } from "../../helpers/getPoeSessionId";
import { electronAPI } from "../electronAPI";

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
  itemId: string;
  hideoutToken: string;
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
  const url = "https://www.pathofexile.com/api/trade2/whisper";

  const requestBody = {
    item: itemId,
    token: hideoutToken,
    continue: true,
    ...(searchQueryId && { query: searchQueryId }),
  };

  const headers = createHeaders(getPoeSessionId());

  const data = await electronAPI.api.requestNoLimiter({
    url,
    method: "POST",
    headers,
    data: requestBody,
  });

  return data;
};
