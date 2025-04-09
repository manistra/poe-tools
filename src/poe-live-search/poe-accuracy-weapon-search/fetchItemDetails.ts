import { extractSearchQueryId } from "../../utils/extractSearchQueryId";

export const fetchItemDetails = async ({
  itemIds,
  sessionId,
  isPoe2 = false,
  searchUrl,
}: {
  itemIds: string[];
  sessionId: string;
  isPoe2: boolean;
  searchUrl: string;
}): Promise<any[]> => {
  try {
    if (!itemIds.length) {
      return [];
    }

    const baseUrl = isPoe2
      ? "https://www.pathofexile.com/api/trade2/fetch"
      : "https://www.pathofexile.com/api/trade/fetch";

    const searchUrlId = extractSearchQueryId(searchUrl);

    const url = `${baseUrl}/${itemIds.join(",")}?query=${searchUrlId}&realm=${
      isPoe2 ? "poe2" : "poe"
    }`;

    console.log(url);

    const response = await window.electron.api.request({
      url,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `POESESSID=${sessionId}`,
        "User-Agent": "anything",
        Origin: "https://www.pathofexile.com",
        Referer: searchUrlId,
      },
    });

    if (response.error) {
      throw new Error(`Failed to fetch item details: ${response.message}`);
    }

    return response.result || [];
  } catch (error) {
    console.error("Error fetching item details:", error);
    return [];
  }
};
