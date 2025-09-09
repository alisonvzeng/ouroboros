import React from "react";
import type { TilePool } from "../utils/tiles";

interface TilesDisplayProps {
  tiles: TilePool;
}

const TilesDisplay: React.FC<TilesDisplayProps> = ({ tiles }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {Object.entries(tiles).map(([letter, count]) =>
        Array.from({ length: count }).map((_, i) => (
          <div
            key={`${letter}-${i}`}
            className="w-8 h-8 flex items-center justify-center border rounded bg-blue-400 font-bold text-lg select-none"
          >
            {letter}
          </div>
        ))
      )}
    </div>
  );
};

export default TilesDisplay;
