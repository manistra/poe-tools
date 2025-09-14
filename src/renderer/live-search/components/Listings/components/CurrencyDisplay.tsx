import React from "react";
import clsx from "clsx";

import { CurrencyCondition, Poe2Currency } from "src/shared/types";
import { getCurrencyImage } from "src/renderer/helpers/getCurrencyImage";

export const CurrencyDisplay: React.FC<{
  amount: number;
  currency: Poe2Currency;
  className?: string;
  iconClassName?: string;
  failingCurrencyCondition?: CurrencyCondition | null;
}> = ({
  amount,
  currency,
  className,
  iconClassName,
  failingCurrencyCondition,
}) => {
  const currencyImage = getCurrencyImage(currency);
  const failingCurrencyImage = getCurrencyImage(
    failingCurrencyCondition?.currency
  );

  return (
    <div className={clsx("flex flex-col items-center gap-2", className)}>
      <div className="w-full text-xl px-2 py-1 border border-poe-mods-fractured border-opacity-25 rounded-md flex items-center flex-row gap-1 text-[#aa9e82] text-[18px] justify-center">
        <div className="w-full flex items-center flex-row justify-center">
          <span>{amount} x</span>
          {currencyImage ? (
            <img
              src={currencyImage}
              alt={currency}
              className={clsx("w-6 h-6 object-contain", iconClassName)}
            />
          ) : (
            <span>{currency}</span>
          )}
        </div>
      </div>

      {failingCurrencyCondition && (
        <div className="w-full py-1 border border-red-700 rounded-md flex items-center flex-col gap-1 px-2 text-sm text-[#aa9e82] bg-red-700/20">
          <span className="text-red-80 border-b border-red-700 pb-1 text-xs">
            Failing Currency Condition
          </span>
          <div className="w-full flex items-center flex-row justify-between">
            {failingCurrencyCondition?.currency && (
              <>
                <div className="flex items-center flex-row text-sm">
                  {failingCurrencyCondition.minPrice &&
                    failingCurrencyCondition.minPrice > 0 && (
                      <div className="flex items-center flex-row mx-auto">
                        <span className="text-gray-500 mr-2">Min:</span>
                        <span className="font-bold mr-1">
                          0{failingCurrencyCondition.minPrice}
                        </span>
                        <img
                          src={failingCurrencyImage || ""}
                          alt={currency}
                          className={clsx(
                            "w-[22px] h-[22px] object-contain",
                            iconClassName
                          )}
                        />
                      </div>
                    )}
                </div>

                <div className="flex items-center flex-row mx-auto">
                  <span className="text-gray-500 mr-2">Max:</span>
                  <span className="font-bold mr-1 text-base">
                    {failingCurrencyCondition.maxPrice}
                  </span>
                  <img
                    src={failingCurrencyImage || ""}
                    alt={currency}
                    className={clsx(
                      "w-[22px] h-[22px] object-contain",
                      iconClassName
                    )}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
