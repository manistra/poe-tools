import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import HttpRequestLimiter from "./HttpRequestLimiter";

interface FetchOptions {
  url: string;
  method: string;
  headers?: Record<string, string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  params?: Record<string, string>;
}

export const rateLimitedApi = async ({
  url,
  method,
  headers,
  data,
  params,
}: FetchOptions) => {
  const startTime = Date.now();
  console.log(`[${startTime}] - [RateLimiter] Queuing API request to: ${url}`);

  return HttpRequestLimiter.schedule(async () => {
    const scheduledTime = Date.now();
    console.log(
      `[${scheduledTime}] - [RateLimiter] Executing API request to: ${url} (queued for ${
        scheduledTime - startTime
      }ms)`
    );

    try {
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

      const response: AxiosResponse = await axios(config);

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
};

export const apiNoLimiter = async ({
  url,
  method,
  headers,
  data,
  params,
}: FetchOptions) => {
  try {
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
    console.log(`[${startTime}] - Making API request (no limiter) to: ${url}`);
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
};
