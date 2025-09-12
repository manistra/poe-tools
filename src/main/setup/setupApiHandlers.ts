import { ipcMain } from "electron";

import { ApiResponse } from "../../shared/types";
import HttpRequestLimiter from "../api/HttpRequestLimiter";
import { persistentStore } from "../../shared/store/sharedStore";
import { apiNoLimiter, rateLimitedApi } from "../api/apis";
import { autoTeleport } from "../poe-trade/autoTeleport";

export function setupApiHandlers() {
  // Initialize with defaults
  HttpRequestLimiter.initialize();

  // Set up callback to update store when tokens change
  HttpRequestLimiter.setTokensChangeCallback((tokens: number) => {
    persistentStore.setRateLimiterTokens(tokens);
  });

  ipcMain.handle(
    "api-request",
    async (
      _,
      options: {
        url: string;
        method: string;
        headers?: Record<string, string>;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data?: any;
        params?: Record<string, string>;
      }
    ): Promise<ApiResponse> => {
      return rateLimitedApi(options);
    }
  );

  ipcMain.handle(
    "api-request-no-limiter",
    async (
      _,
      options: {
        url: string;
        method: string;
        headers?: Record<string, string>;
        data?: any;
        params?: Record<string, string>;
      }
    ): Promise<ApiResponse> => {
      return apiNoLimiter(options);
    }
  );

  // Add handler for getting current reservoir tokens
  ipcMain.handle("get-rate-limiter-tokens", async () => {
    return await HttpRequestLimiter.currentReservoir();
  });

  // Add handler for autoTeleport
  ipcMain.handle(
    "auto-teleport",
    async (
      _,
      request: {
        itemId: string;
        hideoutToken: string;
        searchQueryId?: string;
      }
    ) => {
      return autoTeleport(request);
    }
  );
}
