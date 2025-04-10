import { extractSearchQueryId } from "./extractSearchQueryId";

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
      // Check if the error message indicates a rate limit
      if (response.message) {
        const waitTimeMatch = response.message.match(
          /Please wait (\d+) seconds/
        );
        const waitTime = waitTimeMatch ? waitTimeMatch[1] : "unknown";
        throw new Error(`RATE_LIMIT_EXCEEDED:${waitTime}`);
      }
      throw new Error(`Failed to fetch item details: ${response.message}`);
    }

    return response.result || [];
  } catch (error) {
    // Rethrow rate limit errors to be handled by the caller
    if (
      error instanceof Error &&
      error.message.startsWith("RATE_LIMIT_EXCEEDED")
    ) {
      throw error;
    }
    console.error("Error fetching item details:", error);
    throw error;
  }
};
