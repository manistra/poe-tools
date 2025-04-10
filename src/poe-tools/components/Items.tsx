import React from "react";
import Item from "./Item";
import {
  transformItemData,
  TransformedItemData,
  ItemData,
} from "../utils/transformItemData";

interface ItemsProps {
  items: ItemData[];
}

const Items: React.FC<ItemsProps> = ({ items }) => {
  if (!items || items.length === 0) {
    return <p>No item details available</p>;
  }

  // Transform the raw items into our cleaner structure
  const transformedItems: TransformedItemData[] = items.map(transformItemData);

  return (
    <ul className="space-y-4">
      {transformedItems.map((item, index) => (
        <li key={index}>
          <Item item={item} />
        </li>
      ))}
    </ul>
  );
};

export default Items;
