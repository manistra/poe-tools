import { ItemData } from "../query-weapons-with-amazon-accuracy/utils/calcs/types";
import { extractSearchQueryId } from "../utils/extractSearchQueryId";
import { getPoeSessionId } from "../utils/getPoeSessionId";
import { poe2SearchUrl } from "./api";

import { rateLimitWrapper } from "./rateLimitWrapper";

export const fetchItemDetails = async ({
  itemIds,
  searchUrl = poe2SearchUrl,
  isPoe2 = true,
}: {
  itemIds: string[];
  searchUrl?: string;
  isPoe2?: boolean;
}): Promise<ItemData[]> =>
  rateLimitWrapper(async () => {
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

    const data = await window.electron.api.request({
      url,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `POESESSID=${getPoeSessionId()}`,
        "User-Agent": "anything",
        Origin: "https://www.pathofexile.com",
        Referer: searchUrlId,
      },
    });

    return data.result.map((item: ItemData) => ({
      ...item,
      id: `${item.id}-${new Date().toISOString()}`,
    }));
  });
