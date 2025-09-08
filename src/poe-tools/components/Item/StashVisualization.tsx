import React from "react";

interface StashVisualizationProps {
  x: number;
  y: number;
}

const StashVisualization: React.FC<StashVisualizationProps> = ({ x, y }) => {
  const gridSize = 12;
  const cellSize = 170 / gridSize; // 170px divided by 12 cells

  return (
    <div className="w-[170px] h-[170px] border mx-auto border-poe-mods-fractured border-opacity-25">
      <div className="grid grid-cols-12 grid-rows-12 w-full h-full">
        {Array.from({ length: gridSize * gridSize }, (_, index) => {
          const cellX = index % gridSize;
          const cellY = Math.floor(index / gridSize);
          const isHighlighted = cellX === x && cellY === y;

          return (
            <div
              key={index}
              className={`border border-poe-mods-fractured border-opacity-25 ${
                isHighlighted ? "bg-orange-500" : "bg-transparent"
              }`}
              style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default StashVisualization;
