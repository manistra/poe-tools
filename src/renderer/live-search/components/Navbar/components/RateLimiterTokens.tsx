import React from "react";
import { useRateLimiterTokens, useRateLimitData } from "src/shared/store/hooks";

const RateLimiterTokens: React.FC = () => {
  const [tokens] = useRateLimiterTokens();
  const [rateLimitData] = useRateLimitData();

  const getTokenColor = () => {
    if (tokens === 0) return "text-red-400";
    if (tokens <= 2) return "text-yellow-400";
    return "text-green-400";
  };

  const getProgressColor = () => {
    if (tokens === 0) return "bg-red-500";
    if (tokens <= 2) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="flex flex-col min-w-[200px] max-w-[100px]">
      <div className="flex items-center gap-2 text-sm justify-between">
        <span className="text-xs text-gray-300">Rate Limiter:</span>
        <div className="flex items-center gap-1">
          <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${getProgressColor()}`}
              style={{
                width: `${(tokens / rateLimitData.requestLimit) * 100}%`,
              }}
            />
          </div>
          <span className={`font-mono ${getTokenColor()}`}>
            {tokens}/{rateLimitData.requestLimit}
          </span>
        </div>
      </div>

      <div className="flex justify-between text-gray-500 text-xs w-full">
        <span>[</span>
        <span>
          {rateLimitData.requestLimit} requests per {rateLimitData.interval}{" "}
          seconds
        </span>
        <span>]</span>
      </div>
    </div>
  );
};

export default RateLimiterTokens;
