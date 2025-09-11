import Bottleneck from "bottleneck";
import { HEADER_KEYS } from "../../shared/constants/headerKeys";
import { ApiResponse } from "../../shared/types";

export default class HttpRequestLimiter {
  static config = {
    defaultReservoirValues: {
      requestLimit: 6,
      interval: 4,
    },
    minRequestIntervalMs: 1500,
  };

  static bottleneck = new Bottleneck();

  static isInitialized = false;

  static onTokensChange: ((tokens: number) => void) | null = null;

  static setTokensChangeCallback(callback: (tokens: number) => void): void {
    this.onTokensChange = callback;
  }

  static async notifyTokensChange(): Promise<void> {
    if (this.onTokensChange) {
      const currentTokens = await this.bottleneck.currentReservoir();
      console.log(`Reservoir tokens: ${currentTokens}`);
      this.onTokensChange(currentTokens);
    }
  }

  static initialize(initialResponse?: ApiResponse): Promise<void> {
    if (this.isInitialized) {
      return Promise.resolve();
    }

    return this.rateLimitFromHeaders(initialResponse)
      .then(({ requestLimit, interval }) => {
        console.log(
          `Rate limit: ${requestLimit} requests / ${interval} seconds`
        );
        return this.updateSettings(requestLimit, interval);
      })
      .then(() => {
        this.isInitialized = true;
        this.notifyTokensChange();
      });
  }

  static rateLimitFromHeaders(
    response?: ApiResponse
  ): Promise<{ requestLimit: number; interval: number }> {
    return new Promise((resolve) => {
      if (!response) {
        console.log("Using default rate limits");
        resolve(this.config.defaultReservoirValues);
        return;
      }

      if (response.status && response.status > 299) {
        console.error(`Error fetching rate limit headers: ${response.status}`);
        resolve(this.config.defaultReservoirValues);
        return;
      }

      if (response.headers?.[HEADER_KEYS.X_RATE_LIMIT_ACCOUNT]) {
        const values =
          response.headers[HEADER_KEYS.X_RATE_LIMIT_ACCOUNT].split(":");
        const requestLimit =
          Number(values[0]) || this.config.defaultReservoirValues.requestLimit;
        const interval =
          Number(values[1]) || this.config.defaultReservoirValues.interval;
        resolve({ requestLimit, interval });
        return;
      }

      console.log("Using default rate limits");
      resolve(this.config.defaultReservoirValues);
    });
  }

  static updateSettings(requestLimit: number, interval: number): void {
    this.bottleneck.updateSettings({
      reservoir: requestLimit,
      reservoirRefreshAmount: requestLimit,
      reservoirRefreshInterval: interval * 1000,
      // GGG prohibits bursting requests (even though this is not specified by the rate-limiting headers).
      minTime: Math.max(
        this.config.minRequestIntervalMs,
        interval / requestLimit
      ),
      maxConcurrent: 1,
    });
    this.notifyTokensChange();
  }

  static currentReservoir(): Promise<number> {
    return Promise.resolve(this.bottleneck.currentReservoir());
  }

  static schedule<T>(cb: () => Promise<T>): Promise<T> {
    return this.bottleneck.schedule(() => {
      // Notify before the request
      this.notifyTokensChange();
      return cb().finally(() => {
        // Notify after the request
        this.notifyTokensChange();
      });
    });
  }

  static incrementReservoir(incrementBy: number): Promise<number> {
    const result = this.bottleneck.incrementReservoir(incrementBy);
    this.notifyTokensChange();
    return result;
  }
}
