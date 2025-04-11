export const defaultBodyData = {
  query: {
    status: {
      option: "online",
    },
    stats: [
      {
        type: "and",
        filters: [
          {
            id: "explicit.stat_691932474",
            value: {
              min: 300,
            },
            disabled: false,
          },
        ],
        disabled: false,
      },
    ],
    filters: {
      type_filters: {
        filters: {
          category: {
            option: "weapon.spear",
          },
        },
        disabled: false,
      },
      trade_filters: {
        filters: {
          price: {
            max: 150,
          },
        },
        disabled: false,
      },
      equipment_filters: {
        filters: {
          dps: {
            min: 200,
          },
          crit: {
            min: 8,
            max: null as number | null,
          },
        },
        disabled: false,
      },
    },
  },
  sort: {
    dps: "desc",
  },
};
