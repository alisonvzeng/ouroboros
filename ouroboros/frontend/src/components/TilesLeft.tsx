import React from "react";
import type { TilePool } from "../utils/tiles";

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
    <div className="text-center mb-4">
      <p className="font-semibold">Tiles Left: {totalTiles}</p>
      <p>
        <span className="text-blue-500 font-bold">Vowels: {totalVowels}</span> |{" "}
        <span className="text-green-500 font-bold">
          Consonants: {totalConsonants}
        </span>
      </p>
    </div>
  );
};

export default TilesLeft;
