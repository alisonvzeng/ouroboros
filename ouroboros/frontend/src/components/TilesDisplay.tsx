import React from "react";
import type { TilePool } from "../utils/tiles";
import "../styles/TilesDisplay.css";

interface TilesDisplayProps {
  tiles: TilePool;
}

const TilesDisplay: React.FC<TilesDisplayProps> = ({ tiles }) => {
  return (
    
    <div className="tiles-display-container">
      {Object.entries(tiles).map(([letter, count]) =>
        Array.from({ length: count }).map((_, i) => (
          <div key={`${letter}-${i}`} className="tile">
            {letter}
          </div>
        ))
      )}
    </div>
  );
};

export default TilesDisplay;
