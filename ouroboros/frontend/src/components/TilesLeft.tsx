import React from "react";
import type { TilePool } from "../utils/tiles";
import "../styles/TilesLeft.css";

interface TilesLeftProps {
  tileBag: TilePool;
}

const VOWELS = new Set(["A", "E", "I", "O", "U"]);

const TilesLeft: React.FC<TilesLeftProps> = ({ tileBag }) => {
  const totalVowels = Object.entries(tileBag).reduce(
    (sum, [letter, count]) => sum + (VOWELS.has(letter) ? count : 0),
    0
  );

  const totalConsonants = Object.entries(tileBag).reduce(
    (sum, [letter, count]) => sum + (!VOWELS.has(letter) ? count : 0),
    0
  );

  const totalTiles = totalVowels + totalConsonants;

  return (
    <div className="tiles-left-container">
      <p className="tiles-left-total">Tiles Left: {totalTiles}</p>
      <p>
        <span className="tiles-left-vowels">Vowels: {totalVowels}</span> |{" "}
        <span className="tiles-left-consonants">
          Consonants: {totalConsonants}
        </span>
      </p>
    </div>
  );
};

export default TilesLeft;
