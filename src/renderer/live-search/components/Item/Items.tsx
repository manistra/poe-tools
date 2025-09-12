import React from "react";
import Item from "./Item";

import { useResults } from "src/shared/store/hooks";

const Items: React.FC = () => {
  const { results: items } = useResults();

  if (!items || items.length === 0) {
    return <p>No item details available</p>;
  }

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
