import { TransformedItemData } from "../query-weapons-with-amazon-accuracy/utils/calcs/types";
import { fetchItemDetails } from "./fetchItemDetails";
import { fetchItemIds } from "./fetchItemIds";

const getQueryData = (item: TransformedItemData) => {
  const crit = item?.criticalChance?.replace("%", "");
  const dps = item?.calculatedDamage?.totalDamageWithoutRuneMods?.dps;

  const queryData = {
    query: {
      status: { option: "online" },
      stats: [
        {
          type: "and",
          filters: [
            {
              id: "explicit.stat_691932474",
              value: { min: item?.totalAccuracy - 30 || 0 },
              disabled: false,
            },
          ],
        },
      ],
      filters: {
        equipment_filters: {
          filters: {
            crit: { min: crit ? parseInt(crit) - 0.4 : 0 },
            dps: {
              min: dps ? dps - dps / 20 : 0,
            },
          },
        },
        type_filters: { filters: { category: { option: "weapon.spear" } } },
      },
    },
    sort: { price: "asc" },
  };

  return queryData;
};

export const checkItemPrice = async (item: TransformedItemData) => {
  const queryData = getQueryData(item);

  const response = await fetchItemIds(queryData);

  await new Promise((resolve) => setTimeout(resolve, 500));

  console.log(response);

  try {
    const batchItems = await fetchItemDetails({
      itemIds: response.result.slice(0, 4),
      isPoe2: true,
    });

    const data = {
      url: `https://www.pathofexile.com/trade2/search/poe2/Dawn%20of%20the%20Hunt/${response.id}`,
      prices: batchItems.map(
        (item) =>
          `${item.listing?.price.amount} ${item.listing?.price.currency}`
      ),
    };

    return data as { url: string; prices: string[] };
  } catch (error) {
    console.error(error);
  }
};
