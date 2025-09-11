import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ipcMain } from "electron";

import { ApiResponse } from "../../shared/types";
import HttpRequestLimiter from "../utils/HttpRequestLimiter";
import { persistentStore } from "../../shared/store/sharedStore";

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
        data?: any;
        params?: Record<string, string>;
      }
    ): Promise<ApiResponse> => {
      return HttpRequestLimiter.schedule(async () => {
        try {
          const { url, method, headers, data, params } = options;

          const config: AxiosRequestConfig = {
            url,
            method,
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
              "Content-Type": "application/json",
              ...headers,
            },
            data,
            params,
          };

          const startTime = Date.now();
          console.log(`[${startTime}] - Making API request to: ${url}`);
          const response: AxiosResponse = await axios(config);

          const endTime = Date.now();
          const duration = endTime - startTime;
          console.log(
            `[${endTime}] - API request to: ${url} completed in ${duration}ms`
          );

          return {
            data: response.data,
            headers: response.headers as Record<string, string>,
            status: response.status,
          };
        } catch (error: any) {
          console.error("API request error:", error);

          return {
            error: {
              message: error.message,
              status: error.response?.status,
              headers: error.response?.headers as Record<string, string>,
            },
            headers: error.response?.headers as Record<string, string>,
          };
        }
      });
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
      try {
        const { url, method, headers, data, params } = options;

        const config: AxiosRequestConfig = {
          url,
          method,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Content-Type": "application/json",
            ...headers,
          },
          data,
          params,
        };
        const startTime = Date.now();
        console.log(
          `[${startTime}] - Making API request (no limiter) to: ${url}`
        );
        const response: AxiosResponse = await axios(config);

        const endTime = Date.now();
        const duration = endTime - startTime;
        console.log(
          `[${endTime}] - API request (no limiter) to: ${url} completed in ${duration}ms`
        );

        return {
          data: response.data,
          headers: response.headers as Record<string, string>,
          status: response.status,
        };
      } catch (error: any) {
        console.error("API request error (no limiter):", error);

        return {
          error: {
            message: error.message,
            status: error.response?.status,
            headers: error.response?.headers as Record<string, string>,
          },
          headers: error.response?.headers as Record<string, string>,
        };
      } finally {
        HttpRequestLimiter.incrementReservoir(-1);
      }
    }
  );
}
