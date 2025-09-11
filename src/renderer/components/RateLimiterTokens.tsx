import React from "react";
import { useRateLimiterTokens } from "../../shared/store/hooks";

const RateLimiterTokens: React.FC = () => {
  const [tokens] = useRateLimiterTokens();

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
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-400">Rate Limiter:</span>
      <div className="flex items-center gap-1">
        <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${(tokens / 6) * 100}%` }}
          />
        </div>
        <span className={`font-mono ${getTokenColor()}`}>{tokens}/6</span>
      </div>
    </div>
  );
};

export default RateLimiterTokens;
