import React, { useState } from "react";
import Button from "src/renderer/components/Button";
import Input from "src/renderer/components/Input";
import { electronAPI } from "../api/electronAPI";
import RateLimiterTokens from "./RateLimiterTokens";

// const URL = "https://jsonplaceholder.typicode.com/posts/1";
const URL = "https://localhost:3000/api/ping";

interface ApiTesterProps {
  className?: string;
}

const ApiTester: React.FC<ApiTesterProps> = ({ className = "" }) => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const [noLimiterResults, setNoLimiterResults] = useState<string[]>([]);
  const [isTestingNoLimiter, setIsTestingNoLimiter] = useState(false);
  const [rateLimitRequests, setRateLimitRequests] = useState<number>(13);
  const [noLimiterRequests, setNoLimiterRequests] = useState<number>(13);

  const testRateLimiting = async () => {
    setIsTesting(true);
    setTestResults([]);

    const results: string[] = [];
    let startTime: number | null = null;
    let lastRequestTime: number | null = null;

    // Make requests quickly (with rate limiting)
    console.log(`Making ${rateLimitRequests} requests with rate limiting...`);
    for (let i = 1; i <= rateLimitRequests; i++) {
      const requestStartTime = Date.now();
      if (startTime === null) startTime = requestStartTime;

      try {
        const response = await electronAPI.api.request({
          url: URL,
          method: "GET",
        });
        const endTime = Date.now();
        const duration = endTime - requestStartTime;
        const relativeTime = requestStartTime - startTime;
        const timeDiff =
          lastRequestTime !== null ? requestStartTime - lastRequestTime : 0;

        const result = `${relativeTime}ms - Request ${i}: ${
          response.error ? "ERROR" : "SUCCESS"
        } - ${duration}ms (+${timeDiff}ms)`;
        results.push(result);
        setTestResults([...results]);
        console.log(
          `${relativeTime}ms - Request ${i} completed in ${duration}ms (+${timeDiff}ms)`
        );
      } catch (error: unknown) {
        const endTime = Date.now();
        const duration = endTime - requestStartTime;
        const relativeTime = requestStartTime - startTime;
        const timeDiff =
          lastRequestTime !== null ? requestStartTime - lastRequestTime : 0;

        const errorMessage =
          error instanceof Error ? error.message : String(error);
        const result = `${relativeTime}ms - Request ${i}: ERROR - ${duration}ms - ${errorMessage} (+${timeDiff}ms)`;
        results.push(result);
        setTestResults([...results]);
        console.error(`${relativeTime}ms - Request ${i} failed:`, error);
      }

      lastRequestTime = requestStartTime;
    }

    setIsTesting(false);
  };

  const testRateLimitingNoLimiter = async () => {
    setIsTestingNoLimiter(true);
    setNoLimiterResults([]);

    const results: string[] = [];
    let startTime: number | null = null;
    let lastRequestTime: number | null = null;

    // Make requests quickly (no rate limiting)
    for (let i = 1; i <= noLimiterRequests; i++) {
      const requestStartTime = Date.now();
      if (startTime === null) startTime = requestStartTime;

      try {
        const response = await electronAPI.api.requestNoLimiter({
          url: URL,
          method: "GET",
        });
        const endTime = Date.now();
        const duration = endTime - requestStartTime;
        const relativeTime = requestStartTime - startTime;
        const timeDiff =
          lastRequestTime !== null ? requestStartTime - lastRequestTime : 0;
        const result = `${relativeTime}ms - Request ${i}: ${
          response.error ? "ERROR" : "SUCCESS"
        } - ${duration}ms (+${timeDiff}ms)`;
        results.push(result);
        setNoLimiterResults([...results]);
        console.log(
          `${relativeTime}ms - No Limiter Request ${i} completed in ${duration}ms (+${timeDiff}ms)`
        );
      } catch (error: unknown) {
        const endTime = Date.now();
        const duration = endTime - requestStartTime;
        const relativeTime = requestStartTime - startTime;
        const timeDiff =
          lastRequestTime !== null ? requestStartTime - lastRequestTime : 0;
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        const result = `${relativeTime}ms - Request ${i}: ERROR - ${duration}ms - ${errorMessage} (+${timeDiff}ms)`;
        results.push(result);
        setNoLimiterResults([...results]);
        console.error(
          `${relativeTime}ms - No Limiter Request ${i} failed:`,
          error
        );
      }

      lastRequestTime = requestStartTime;
    }

    setIsTestingNoLimiter(false);
  };

  return (
    <div className={`flex flex-col gap-4 ${className} w-full`}>
      {/* Rate Limiting Test Buttons */}
      <div className="flex gap-2 justify-between">
        <div className="flex flex-row gap-2">
          <Button
            variant="danger"
            onClick={testRateLimiting}
            disabled={isTesting}
          >
            {isTesting
              ? "Testing Rate Limit..."
              : `Test Rate Limiting (${rateLimitRequests} calls)`}
          </Button>
          <Button
            variant="danger"
            onClick={testRateLimitingNoLimiter}
            disabled={isTestingNoLimiter}
          >
            {isTestingNoLimiter
              ? "Testing No Limiter..."
              : `Test No Limiter (${noLimiterRequests} calls)`}
          </Button>
        </div>
        <RateLimiterTokens />
      </div>

      {/* Test Results */}
      <div className="flex flex-row gap-2 w-full">
        <div className="bg-gray-800 p-4 rounded-lg w-full min-h-[400px]">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-green-400 w-full">
              Rate Limiting Test Results:
            </h3>
            <Input
              type="number"
              value={rateLimitRequests}
              onChange={(value) => setRateLimitRequests(Number(value))}
              label="Requests"
              min={1}
              className="w-20"
            />
          </div>
          <div className="space-y-1">
            {testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono text-gray-300">
                {result}
              </div>
            ))}
          </div>
        </div>

        {/* No Limiter Test Results */}
        <div className="bg-gray-800 p-4 rounded-lg w-full min-h-[400px]">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-yellow-400">
              No Limiter Test Results:
            </h3>
            <Input
              type="number"
              value={noLimiterRequests}
              onChange={(value) => setNoLimiterRequests(Number(value))}
              label="Requests"
              min={1}
              className="w-20"
            />
          </div>
          <div className="space-y-1">
            {noLimiterResults.map((result, index) => (
              <div key={index} className="text-sm font-mono text-gray-300">
                {result}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiTester;
