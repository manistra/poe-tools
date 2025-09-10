import { extractSearchQueryId } from "../helpers/extractSearchQueryId";
import { getPoeSessionId } from "../helpers/getPoeSessionId";
import { ItemData } from "../../shared/types";
import { poe2SearchUrl } from "./api";
import { electronAPI } from "./electronAPI";

export const fetchItemDetails = async ({
  itemIds,
  searchUrl = poe2SearchUrl,
  isPoe2 = true,
}: {
  itemIds: string[];
  searchUrl?: string;
  isPoe2?: boolean;
}): Promise<ItemData[]> => {
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

  const data = await electronAPI.api.request({
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
};
