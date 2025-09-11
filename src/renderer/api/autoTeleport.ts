import { createHeaders } from "./api";
import { getPoeSessionId } from "../helpers/getPoeSessionId";
import { electronAPI } from "./electronAPI";

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
