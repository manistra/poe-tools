const userAgent = () => {
  return "PoE Live Search Manager";
};

const cookieHeader = () => {
  const poeSessionId = window.localStorage.getItem("sessionId");

  return `POESESSID=${poeSessionId}`;
};

export const apiHeaders = () => {
  return {
    "Content-Type": "application/json",
    Cookie: cookieHeader(),
    "User-Agent": userAgent(),
  };
};
