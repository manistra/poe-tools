import { CurrencyCondition, ItemData } from "src/shared/types";

export const getFailingCurrencyCondition = (
  item: ItemData,
  currencyConditions: CurrencyCondition[] | []
) => {
  const currencyCondition = currencyConditions.find(
    (condition) => item.listing?.price?.currency === condition.currency
  );

  if (!currencyCondition) return null;

  if (
    currencyCondition?.minPrice &&
    item.listing?.price?.amount &&
    item.listing?.price?.amount < currencyCondition.minPrice
  ) {
    return currencyCondition;
  }

  if (
    currencyCondition?.maxPrice &&
    item.listing?.price?.amount &&
    item.listing?.price?.amount > currencyCondition.maxPrice
  ) {
    return currencyCondition;
  }

  return null;
};
