import { apiHeaders } from "../api";

export const fetchItemDetails = async (
  itemIds: string[],
  isPoe2 = false
): Promise<any[]> => {
  try {
    const baseUrl = isPoe2
      ? "https://www.pathofexile.com/api/trade2/fetch/poe2"
      : "https://www.pathofexile.com/api/trade/fetch";

    const url = `${baseUrl}/${itemIds.join(",")}`;

    const response = await fetch(url, {
      headers: apiHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch item details: ${response.status}`);
    }

    const data = await response.json();
    return data.result || [];
  } catch (error) {
    console.error("Error fetching item details:", error);
    return [];
  }
};
