import React from "react";
import Item from "./Item";
import { TransformedItemData } from "../../live-search/utils/types";

interface ItemsProps {
  items: TransformedItemData[];
}

const Items: React.FC<ItemsProps> = ({ items }) => {
  if (!items || items.length === 0) {
    return <p>No item details available</p>;
  }

  // Transform the raw items into our cleaner structure

  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item.id}>
          <Item key={item.id} item={item} />
        </li>
      ))}
    </ul>
  );
};

export default Items;
