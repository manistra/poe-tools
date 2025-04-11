// Function to create headers with the provided POESESSID
export const createHeaders = (poesessid: string) => {
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
