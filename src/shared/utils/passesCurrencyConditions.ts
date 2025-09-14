import { CurrencyCondition, TransformedItemData } from "src/shared/types";

export const passesCurrencyConditions = (
  item: TransformedItemData,
  currencyConditions: CurrencyCondition[] | []
) => {
  if (
    !currencyConditions?.some(
      (condition) => item.price?.currency === condition.currency
    )
  )
    return true;

  const currencyCondition = currencyConditions.find(
    (condition) => item.price?.currency === condition.currency
  );

  if (
    currencyCondition?.minPrice &&
    item.price?.amount &&
    item.price.amount < currencyCondition.minPrice
  ) {
    return false;
  }

  if (
    currencyCondition?.maxPrice &&
    item.price?.amount &&
    item.price.amount > currencyCondition.maxPrice
  ) {
    return false;
  }

  return true;
};
