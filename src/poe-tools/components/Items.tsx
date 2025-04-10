import React from "react";
import Item from "./Item";
import { TransformedItemData } from "../utils/transformItemData";

interface ItemsProps {
  items: TransformedItemData[];
  calculateForAmazonAscendancy?: boolean;
}

const Items: React.FC<ItemsProps> = ({
  items,
  calculateForAmazonAscendancy,
}) => {
  if (!items || items.length === 0) {
    return <p>No item details available</p>;
  }

  // Transform the raw items into our cleaner structure

  return (
    <ul className="space-y-4">
      {items.map((item, index) => (
        <li key={index}>
          <Item
            item={item}
            calculateForAmazonAscendancy={calculateForAmazonAscendancy}
          />
        </li>
      ))}
    </ul>
  );
};

export default Items;
