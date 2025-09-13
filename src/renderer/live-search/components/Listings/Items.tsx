import React from "react";
import Item from "./components/Item";

import { useResults } from "src/shared/store/hooks";
import clsx from "clsx";
import { TrashIcon } from "@heroicons/react/24/outline";

const Items: React.FC = () => {
  const { results: items, clearResults } = useResults();

  const handleClearListings = () => {
    clearResults();
  };

  return (
    <div className="w-full flex flex-col gap-5 card">
      <div className="flex justify-between items-center border-b border-gray-900 mb-2">
        <h1 className="text-xl text-gray-300 font-semibold mb-2">Listings:</h1>

        <button
          title="Delete All Listings"
          onClick={() => handleClearListings()}
          className={clsx(
            "text-xs p-1 transition-transform duration-200 opacity-60 hover:opacity-100 hover:scale-[104%]",
            items.length === 0 && "opacity-30"
          )}
        >
          <TrashIcon className="size-[22px]" />
        </button>
      </div>

      {(!items || items.length === 0) && (
        <p className="text-gray-400 text-sm">No items to show...</p>
      )}

      <ul className="space-y-6 h-full overflow-y-auto">
        {items.map((item, index) => (
          <li key={`${item.id}-${index}`}>
            <Item item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Items;
