import { WebSocketState } from "src/shared/types";

export const isWsStateAnyOf = (
  readyState: WebSocketState | null | undefined,
  ...statuses: WebSocketState[]
): boolean => {
  const statusToCheckAgainst = readyState ?? WebSocketState.CLOSED;

  return statuses.some((s) => s === statusToCheckAgainst);
};
