import Bottleneck from "bottleneck";
import { HEADER_KEYS } from "../../shared/constants/headerKeys";
import { persistentStore } from "src/shared/store/sharedStore";

import { fetchItemDetails } from "../poe-trade/fetchItemDetails";
import { AxiosResponse } from "axios";

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
      if (currentTokens !== null) {
        this.onTokensChange(currentTokens);
      }
    }
  }

  static initialize(): Promise<void> {
    if (this.isInitialized) {
      return Promise.resolve();
    }

    return fetchItemDetails(["1"], "poe2").then((response) => {
      return this.rateLimitFromHeaders(response as AxiosResponse)
        .then(({ requestLimit, interval }) => {
          persistentStore.addLog(
            `Rate limit from reuqest: ${requestLimit} requests / ${interval} seconds`
          );
          return this.updateSettings(requestLimit, interval);
        })
        .then(() => {
          this.isInitialized = true;
          this.notifyTokensChange();
        });
    });
  }

  static rateLimitFromHeaders(
    response?: AxiosResponse
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
        const headerValue = response.headers[HEADER_KEYS.X_RATE_LIMIT_ACCOUNT];
        if (headerValue) {
          const values = headerValue.split(":");
          const requestLimit =
            Number(values[0]) ||
            this.config.defaultReservoirValues.requestLimit;
          const interval =
            Number(values[1]) || this.config.defaultReservoirValues.interval;
          resolve({ requestLimit, interval });
          return;
        }
      }

      console.log("Using default rate limits");
      resolve(this.config.defaultReservoirValues);
    });
  }

  static updateSettings(requestLimit: number, interval: number): void {
    const calculatedIncomingMinTime = (interval / requestLimit) * 7000;

    const minTime = Math.max(
      this.config.minRequestIntervalMs, // 1500ms
      calculatedIncomingMinTime
    );

    console.log(
      `[HttpRequestLimiter] Updating settings: requestLimit=${requestLimit}, interval=${interval}s, minTime=${minTime}ms`
    );
    console.log("[HttpRequestLimiter] Updating settings", {
      requestLimit,
      interval,
      minTime,
    });

    this.bottleneck.updateSettings({
      reservoir: requestLimit,
      reservoirRefreshAmount: requestLimit,
      reservoirRefreshInterval: interval * 1000,
      // GGG prohibits bursting requests (even though this is not specified by the rate-limiting headers).
      // Always enforce minimum 1500ms between requests
      minTime: minTime,
      maxConcurrent: 1,
    });

    this.notifyTokensChange();
    persistentStore.setRateLimitData({ requestLimit, interval });
  }

  static async currentReservoir(): Promise<number> {
    const tokens = await this.bottleneck.currentReservoir();
    return tokens ?? 0;
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

  static async cancelAll(): Promise<void> {
    await this.bottleneck.stop({ dropWaitingJobs: true });

    this.bottleneck = new Bottleneck({
      maxConcurrent: 1,
      minTime: 1500,
    });

    const currentState = persistentStore.getState();
    this.updateSettings(
      currentState.rateLimitData.requestLimit ||
        this.config.defaultReservoirValues.requestLimit,
      currentState.rateLimitData.interval ||
        this.config.defaultReservoirValues.interval
    );

    persistentStore.addLog(
      "[HttpRequestLimiter] All queued requests cancelled and limiter recreated"
    );
  }

  static getQueueStatus = async () => {
    const wsQueued = this.bottleneck.queued();
    const wsRunning = await this.bottleneck.running();

    return {
      ws: { queued: wsQueued, running: wsRunning },
    };
  };
}
