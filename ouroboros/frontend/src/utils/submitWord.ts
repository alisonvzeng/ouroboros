import { useState, type Dispatch } from "react";
import { isValidWord } from "./validWord";
import { getOverlap, canBuildWord, removeUsedLetters } from "./tiles";
import type { TilePool } from "./tiles";
import { calculateScore } from "./calculateScore";

export async function submitWord(
  word: string,
  setFeedback: Dispatch<string>,
  chain: string[],
  setChain: Dispatch<string[]>,
  tiles: TilePool,
  setTiles: Dispatch<TilePool>,
  score: number,
  setScore: Dispatch<number>,
  values: Record<string, number>,
  playedWords: string[],
  setPlayedWords: Dispatch<string[]>,
  setLettersVisible: Dispatch<boolean>,
  tileBag: TilePool,
  setTileBag: Dispatch<TilePool>
) {
  setFeedback("");
  word = word.toUpperCase();

  console.log("Submitting word:", word);

  if (!(await isValidWord(word))) {
    setFeedback(word + " is not a valid word.");
    return false;
  }

  const currentChainStr = chain.join("");
  const overlap = getOverlap(currentChainStr, word);

  if (!canBuildWord(word, tiles, currentChainStr)) {
    setFeedback("Not enough tiles to build word.");
    return false;
  }

  if (chain.length > 0) {
    const chainFullyOverlapsWord = overlap === word.length;

    if (overlap < 1) {
      setFeedback("No valid overlap with previous word.");
      return false;
    }

    if (chainFullyOverlapsWord) {
      setFeedback(word + " fully overlaps the previous word.");
      return false;
    }
  }

  setLettersVisible(false);
  console.log("Hiding letters for animation");
  await new Promise((resolve) => setTimeout(resolve, 300));

  const letterDiff = word.slice(overlap).split("");

  const newChain = [...chain, ...letterDiff];
  setChain(newChain);
  const newScore = score + calculateScore(word, newChain, values);
  setScore(newScore);
  setTiles(removeUsedLetters(word, tiles, currentChainStr));
  const newlyPlayedWords = [...playedWords, word];
  setPlayedWords(newlyPlayedWords);

  const newBag = { ...tileBag };
  const availableLetters = Object.keys(newBag).filter((l) => newBag[l] > 0);

  if (availableLetters.length > 0) {
    const idx = Math.floor(Math.random() * availableLetters.length);
    const letter = availableLetters[idx];

    // Remove from bag
    newBag[letter]--;

    // Add to tiles
    const newTiles = {
      ...tiles,
      [letter]: (tiles[letter] || 0) + 1,
    };
    setTiles(newTiles);
    setScore(score - 1); // Penalty for drawing a tile
  }

  console.log(
    "Total tiles left in bag:",
    Object.values(newBag).reduce((sum, count) => sum + count, 0)
  );
  setTileBag(newBag);

  return true;
}
