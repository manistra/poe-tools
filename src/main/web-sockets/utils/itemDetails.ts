import { poe2FetchAPI, poeFetchAPI } from "./baseUrls";
import { rateLimitedApi } from "src/main/rate-limited-fetch/rateLimitedApi";
import { apiHeaders } from "./apiHeaders";

export const fetchItemDetails = (ids: string[], game: "poe" | "poe2") => {
  try {
    const itemUrl =
      game === "poe2" ? `${poe2FetchAPI}/${ids}` : `${poeFetchAPI}/${ids}`;

    return rateLimitedApi({
      url: itemUrl,
      method: "GET",
      headers: apiHeaders(),
    });
  } catch (error) {
    console.error(error);
  }
};
