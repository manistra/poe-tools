import React from "react";
import Item from "./Item";
import { TransformedItemData } from "../live-search/types";

interface ItemsProps {
  items: TransformedItemData[];
  showSaveButton?: boolean;
}

const Items: React.FC<ItemsProps> = ({ items, showSaveButton }) => {
  if (!items || items.length === 0) {
    return <p>No item details available</p>;
  }

  // Transform the raw items into our cleaner structure

  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item.id}>
          <Item key={item.id} item={item} showSaveButton={showSaveButton} />
        </li>
      ))}
    </ul>
  );
};

export default Items;
