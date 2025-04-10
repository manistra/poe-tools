import React from "react";
import Item from "./Item";

interface ItemProps {
  items: any[];
  isLoading: boolean;
}

const Items: React.FC<ItemProps> = ({ items, isLoading }) => {
  if (isLoading) {
    return <p>Loading item details...</p>;
  }

  if (!items || items.length === 0) {
    return <p>No item details available</p>;
  }

  return (
    <ul className="space-y-4">
      {items.map((item, index) => {
        return (
          <li key={index}>
            <Item item={item} />
          </li>
        );
      })}
    </ul>
  );
};

export default Items;
