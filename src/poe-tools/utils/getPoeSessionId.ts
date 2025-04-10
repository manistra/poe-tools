export const getPoeSessionId = () => {
  const sessionId = window.localStorage.getItem("poeSessionId");
  return sessionId;
};
