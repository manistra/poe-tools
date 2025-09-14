import React from "react";
import { CurrencyCondition } from "src/shared/types";
import { getCurrencyImage } from "src/renderer/helpers/getCurrencyImage";

type CurrencyConditionViewProps = {
  currencyConditions: CurrencyCondition[];
};

const CurrencyConditionView: React.FC<CurrencyConditionViewProps> = ({
  currencyConditions,
}) => {
  return (
    <div className="flex flex-wrap gap-1">
      {currencyConditions?.map((condition, index) => (
        <div
          key={condition.currency + index}
          className="flex flex-row items-center rounded border border-gray-700/30 text-[10px] text-gray-500 bg-gradient-to-l from-[#000000] to-green-900/20"
        >
          <div className="p-[2px] border-r border-dashed border-gray-700/30">
            <img
              title={condition.currency}
              src={getCurrencyImage(condition.currency)}
              alt={condition.currency}
              className="w-[16px] h-[16px] object-contain"
            />
          </div>
          {condition.minPrice && (
            <div className="px-1 border-r border-dashed border-gray-700/30">
              <span>Min: </span>
              <span className="font-bold text-gray-300">
                {condition.minPrice}
              </span>
            </div>
          )}
          {condition.maxPrice && (
            <div className="px-1">
              <span>Max: </span>
              <span className="font-bold text-gray-300">
                {condition.maxPrice}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CurrencyConditionView;
