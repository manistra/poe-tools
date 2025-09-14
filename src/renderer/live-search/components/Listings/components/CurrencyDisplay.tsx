import React from "react";
import clsx from "clsx";
import alchImg from "src/renderer/assets/currency/alch.png";
import annulImg from "src/renderer/assets/currency/annul.png";
import augImg from "src/renderer/assets/currency/aug.png";
import chaosImg from "src/renderer/assets/currency/chaos.png";
import divineImg from "src/renderer/assets/currency/divine.png";
import exaltedImg from "src/renderer/assets/currency/exalted.png";
import mirrorImg from "src/renderer/assets/currency/mirror.png";
import regalImg from "src/renderer/assets/currency/regal.png";
import transmuteImg from "src/renderer/assets/currency/transmute.png";
import vaalImg from "src/renderer/assets/currency/vaal.png";

export const CurrencyDisplay: React.FC<{
  amount: number;
  currency: string;
  className?: string;
  iconClassName?: string;
}> = ({ amount, currency, className, iconClassName }) => {
  const getCurrencyImage = (currency: string) => {
    switch (currency.toLowerCase()) {
      case "alch":
      case "alchemy":
        return alchImg;
      case "annul":
        return annulImg;
      case "aug":
      case "augment":
        return augImg;
      case "chaos":
        return chaosImg;
      case "divine":
        return divineImg;
      case "exalted":
      case "exalt":
        return exaltedImg;
      case "mirror":
        return mirrorImg;
      case "regal":
        return regalImg;
      case "transmute":
        return transmuteImg;
      case "vaal":
        return vaalImg;
      default:
        return null;
    }
  };

  const currencyImage = getCurrencyImage(currency);

  return (
    <div
      className={clsx(
        "flex items-center gap-1 text-[#aa9e82] text-[18px] justify-center",
        className
      )}
    >
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
  );
};
