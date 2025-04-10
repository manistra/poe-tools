import React from "react";
import Item from "./Item";

interface ItemProps {
  items: any[];
}

const Items: React.FC<ItemProps> = ({ items }) => {
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
