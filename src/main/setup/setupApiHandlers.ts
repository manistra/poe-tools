import { ipcMain, clipboard } from "electron";

import { ApiResponse } from "../../shared/types";
import HttpRequestLimiter from "../api/HttpRequestLimiter";
import { persistentStore } from "../../shared/store/sharedStore";
import { apiNoLimiter, rateLimitedApi } from "../api/apis";
import { autoTeleport } from "../poe-trade/autoTeleport";
import { sendWhisper } from "../poe-trade/sendWhisper";

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

  // Add handler for sendWhisper
  ipcMain.handle(
    "send-whisper",
    async (
      _,
      request: {
        itemId: string;
        token: string;
        searchQueryId?: string;
      }
    ) => {
      return sendWhisper(request);
    }
  );

  // Clipboard handler
  ipcMain.handle("copy-to-clipboard", async (_, text: string) => {
    try {
      clipboard.writeText(text);
      return { success: true };
    } catch (error) {
      console.error("Clipboard copy failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  });
}
