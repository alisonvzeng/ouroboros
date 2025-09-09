// hooks/useTileBag.ts
import { useState } from "react";
import type { TilePool } from "./tiles";
import {
  generateTileBag,
  generateTilesByFrequency,
  arrayToTilePool,
  tilePoolToArray,
  shuffleArray,
} from "./tiles";

const VOWELS = new Set(["A", "E", "I", "O", "U"]);

export function initialTileBag(
  initialMode: "Daily Challenge" | "Endless",
  seed?: number
) {
  const tileBag =
    initialMode === "Daily Challenge"
      ? generateTileBag(10, seed)
      : generateTileBag(200);
  const tiles =
    initialMode === "Daily Challenge"
      ? generateTilesByFrequency(10, seed)
      : generateTilesByFrequency(10);

  return { tileBag, tiles };
}

export function alphabetizeTiles(
  setTiles: React.Dispatch<React.SetStateAction<TilePool>>
) {
  setTiles((prevTiles) => arrayToTilePool(tilePoolToArray(prevTiles).sort()));
}

export function randomizeTiles(
  setTiles: React.Dispatch<React.SetStateAction<TilePool>>
) {
  setTiles((prevTiles) =>
    arrayToTilePool(shuffleArray(tilePoolToArray(prevTiles)))
  );
}

export function drawTilesByType(
  count: number,
  type: "vowel" | "consonant",
  setTileBag: React.Dispatch<React.SetStateAction<TilePool>>,
  setTiles: React.Dispatch<React.SetStateAction<TilePool>>
) {
  setTileBag((prevBag) => {
    const newBag: TilePool = { ...prevBag };
    const drawn: string[] = [];

    for (let i = 0; i < count; i++) {
      // Filter letters by type and availability **on each iteration**
      const availableLetters = Object.keys(newBag).filter(
        (l) =>
          newBag[l] > 0 && (type === "vowel" ? VOWELS.has(l) : !VOWELS.has(l))
      );

      if (availableLetters.length === 0) break;

      const idx = Math.floor(Math.random() * availableLetters.length);
      const letter = availableLetters[idx];
      drawn.push(letter);

      newBag[letter]--;
    }

    console.log("Drawn letters:", drawn);

    // Update player's tiles
    setTiles((prevTiles) => {
      const updated = { ...prevTiles };
      for (const tile of drawn) {
        updated[tile] = (updated[tile] || 0) + 1;
      }
      return updated;
    });

    const totalTilesLeft = Object.values(newBag).reduce(
      (sum, count) => sum + count,
      0
    );
    console.log("Total tiles left in bag:", totalTilesLeft);
    return newBag;
  });
}
