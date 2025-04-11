import React from "react";
import Item from "./Item";
import { TransformedItemData } from "../query-weapons-with-amazon-accuracy/utils/calcs/types";

interface ItemsProps {
  items: TransformedItemData[];
  calculateForAmazonAscendancy?: boolean;
  automaticallyCheckPrice?: boolean;
  showSaveButton?: boolean;
}

const Items: React.FC<ItemsProps> = ({
  items,
  calculateForAmazonAscendancy,
  automaticallyCheckPrice,
  showSaveButton,
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
            automaticallyCheckPrice={automaticallyCheckPrice}
            calculateForAmazonAscendancy={calculateForAmazonAscendancy}
            showSaveButton={showSaveButton}
          />
        </li>
      ))}
    </ul>
  );
};

export default Items;
