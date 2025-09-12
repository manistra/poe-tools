/**
 * Extracts the search query ID from a Path of Exile trade URL
 *
 * Example:
 * Input: "https://www.pathofexile.com/trade2/search/poe2/Dawn%20of%20the%20Hunt/neo0a8Mt0/live"
 * Output: "neo0a8Mt0"
 *
 * @param url The Path of Exile trade URL
 * @returns The search query ID or null if not found
 */
export const extractSearchQueryId = (url: string): string | null => {
  try {
    // Handle both PoE and PoE2 URL formats
    // Regular expression to match the search ID pattern
    const regex = /\/([a-zA-Z0-9]{8,})(\/live)?$/;
    const match = url.match(regex);

    if (match && match[1]) {
      return match[1];
    }

    // Alternative approach using URL parsing if the regex fails
    const urlParts = url.split("/");
    // Filter out empty strings and 'live' from the end
    const filteredParts = urlParts.filter((part) => part && part !== "live");

    // The search ID is typically the last part of the URL (excluding 'live')
    if (filteredParts.length > 0) {
      const lastPart = filteredParts[filteredParts.length - 1];
      // Verify it looks like a search ID (alphanumeric, typically 8+ chars)
      if (/^[a-zA-Z0-9]{8,}$/.test(lastPart ?? "")) {
        return lastPart ?? null;
      }
    }

    return null;
  } catch (error) {
    console.error("Error extracting search query ID:", error);
    return null;
  }
};
