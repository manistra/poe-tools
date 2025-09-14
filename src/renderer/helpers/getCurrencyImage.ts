// Import currency images
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
import { Poe2Currency } from "src/shared/types";

// Function to get currency image
export const getCurrencyImage = (
  currency: Poe2Currency
): string | undefined => {
  switch (currency) {
    case "alch":
      return alchImg;
    case "annul":
      return annulImg;
    case "aug":
      return augImg;
    case "chaos":
      return chaosImg;
    case "divine":
      return divineImg;
    case "exalted":
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
      return undefined;
  }
};
