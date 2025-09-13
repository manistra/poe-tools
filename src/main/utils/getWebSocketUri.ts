import { poe2WsUri, poeWsUri } from "./baseUrls";

export const poeTradeUrl =
  /\/([a-zA-Z0-9]+)\/search\/(?:poe2\/)?([a-zA-Z0-9%]+)\/([a-zA-Z0-9]+)/;

const getWebSocketUri = (url: string) => {
  const matchDetails = url.match(poeTradeUrl);

  const [, game, league, id] = matchDetails ?? [];

  if (game === "trade") {
    return `${poeWsUri}/${league}/${id}`;
  }
  return `${poe2WsUri}/${league}/${id}`;
};

export default getWebSocketUri;
