import axios, { AxiosRequestConfig } from "axios";
import { ipcMain } from "electron";

export function setupApiHandler() {
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
    ) => {
      try {
        const { url, method, headers, data, params } = options;

        const config: AxiosRequestConfig = {
          url,
          method,
          headers,
          data,
          params,
        };

        console.log(`Making API request to: ${url}`);
        const response = await axios(config);
        return response.data;
      } catch (error) {
        console.error("API request error:", error);
        // Return a structured error object
        return {
          error: true,
          message: error.message,
          status: error.response?.status,
        };
      }
    }
  );
}
