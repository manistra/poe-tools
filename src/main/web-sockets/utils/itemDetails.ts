import { poe2FetchAPI, poeFetchAPI } from "./baseUrls";
import { rateLimitedApi } from "src/main/api/apis";
import { apiHeaders } from "./apiHeaders";
import { ItemData } from "src/shared/types";
import { AxiosResponse } from "axios";

export const fetchItemDetails = async (ids: string[], game: "poe" | "poe2") => {
  try {
    const itemUrl =
      game === "poe2" ? `${poe2FetchAPI}/${ids}` : `${poeFetchAPI}/${ids}`;

    return (await rateLimitedApi({
      url: itemUrl,
      method: "GET",
      headers: apiHeaders(),
    })) as unknown as Promise<AxiosResponse<{ result: ItemData[] }>>;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
