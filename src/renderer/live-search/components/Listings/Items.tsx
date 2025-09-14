import React, { useRef, useEffect } from "react";
import Item from "./components/Item";

import { useResults } from "src/shared/store/hooks";
import clsx from "clsx";
import { TrashIcon } from "@heroicons/react/24/outline";
import { electronAPI } from "src/renderer/api/electronAPI";

const Items: React.FC = () => {
  const { results: items, clearResults } = useResults();
  const scrollContainerRef = useRef<HTMLUListElement>(null);
  const previousItemsLengthRef = useRef<number>(0);

  const handleClearListings = () => {
    clearResults();
  };

  // Auto-scroll to newest item when new items arrive
  useEffect(() => {
    const currentLength = items.length;
    const previousLength = previousItemsLengthRef.current;

    // Only scroll if items were added (not removed or cleared)
    if (currentLength > previousLength && previousLength > 0) {
      const scrollContainer = scrollContainerRef.current;
      if (scrollContainer) {
        // Scroll to top to show the newest item
        scrollContainer.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    }

    // Update the previous length reference
    previousItemsLengthRef.current = currentLength;
  }, [items.length]);

  return (
    <div className="w-full flex flex-col card">
      <div className="flex justify-between items-center border-b border-gray-900">
        <h1 className="text-xl text-gray-300 mb-2">Listings</h1>

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

      <ul
        ref={scrollContainerRef}
        className="space-y-12 p-5 h-full overflow-y-auto"
      >
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
