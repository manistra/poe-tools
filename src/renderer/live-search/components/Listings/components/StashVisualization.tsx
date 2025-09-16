import React from "react";

interface StashVisualizationProps {
  x?: number;
  y?: number;
}

const StashVisualization: React.FC<StashVisualizationProps> = ({ x, y }) => {
  const gridSize = 12;
  const cellSize = 240 / gridSize; // 170px divided by 12 cells

  return (
    <div className="w-[240px] h-[240px] border mx-auto border-poe-mods-fractured border-opacity-25">
      <div className="grid grid-cols-12 grid-rows-12 w-full h-full">
        {Array.from({ length: gridSize * gridSize }, (_, index) => {
          const cellX = index % gridSize;
          const cellY = Math.floor(index / gridSize);
          const isHighlighted = cellX === x && cellY === y;

          return (
            <div
              key={index}
              className={`border border-poe-mods-fractured border-opacity-25 ${
                isHighlighted ? "bg-orange-300" : "bg-transparent"
              }`}
              style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
              }}
            >
              {isHighlighted && (
                <div className="w-full h-full flex items-center justify-center font-bold text-sm font-bold text-black">
                  {x}
                  {y}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StashVisualization;
