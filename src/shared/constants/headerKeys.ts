export const HEADER_KEYS = {
  X_RATE_LIMIT_ACCOUNT: "x-rate-limit-account",
  X_RATE_LIMIT_ACCOUNT_STATE: "x-rate-limit-account-state",
  X_RATE_LIMIT_IP: "x-rate-limit-ip",
  X_RATE_LIMIT_IP_STATE: "x-rate-limit-ip-state",
  X_RATE_LIMIT_REMAINING: "x-rate-limit-remaining",
  RETRY_AFTER: "retry-after",
} as const;

export default HEADER_KEYS;
