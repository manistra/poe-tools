import { WebSocketState } from "src/shared/types";

export const isWsStateAnyOf = (
  readyState: WebSocketState,
  ...statuses: WebSocketState[]
): boolean => {
  const statusToCheckAgainst = readyState ? readyState : WebSocketState.CLOSED;

  return statuses.some((s) => s === statusToCheckAgainst);
};
