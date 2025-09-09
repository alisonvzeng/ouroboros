import { z } from "zod";
import FREQUENCIES from "../data/frequencies.json";
import { isValidWord } from "./validWord";

export type TilePool = Record<string, number>;

const frequenciesSchema = z.record(z.string(), z.number().min(0));
const parsedFrequencies = frequenciesSchema.safeParse(FREQUENCIES);
if (!parsedFrequencies.success) {
  throw new Error("Invalid letter frequencies data");
}
const frequencies = parsedFrequencies.data;

const VOWELS = new Set(["A", "E", "I", "O", "U"]);

// #region: Tile Bag Generation
export function generateTileBag(
  numberOfTiles: number,
  seed?: number,
  vowelRatio = 0.4 // 40% vowels by default
): TilePool {
  const VOWELS = new Set(["A", "E", "I", "O", "U"]);

  // Separate letters into vowels and consonants
  const vowelPool = Object.entries(frequencies)
    .filter(([letter]) => VOWELS.has(letter))
    .flatMap(([letter, count]) => Array(count).fill(letter));

  const consonantPool = Object.entries(frequencies)
    .filter(([letter]) => !VOWELS.has(letter))
    .flatMap(([letter, count]) => Array(count).fill(letter));

  // Shuffle pools
  const shuffledVowels = seed
    ? shuffleWithSeed(vowelPool, seed)
    : shuffleArray(vowelPool);
  const shuffledConsonants = seed
    ? shuffleWithSeed(consonantPool, seed + 1)
    : shuffleArray(consonantPool);

  // Determine number of vowels and consonants
  const numVowels = Math.min(
    Math.round(numberOfTiles * vowelRatio),
    shuffledVowels.length
  );
  const numConsonants = Math.min(
    numberOfTiles - numVowels,
    shuffledConsonants.length
  );

  // Pick letters
  const selected = [
    ...shuffledVowels.slice(0, numVowels),
    ...shuffledConsonants.slice(0, numConsonants),
  ];

  // Shuffle final selection
  const finalSelection = seed
    ? shuffleWithSeed(selected, seed + 2)
    : shuffleArray(selected);

  // Convert to TilePool
  const bag: TilePool = {};
  for (const letter of finalSelection) {
    bag[letter] = (bag[letter] || 0) + 1;
  }

  return bag;
}
export function countTiles(tileBag: TilePool): number {
  return Object.values(tileBag).reduce((sum, count) => sum + count, 0);
}

function weightedRandomLetter(freqs: Record<string, number>): string {
  const letters = Object.keys(freqs);
  const total = Object.values(freqs).reduce((a, b) => a + b, 0);

  const rand = Math.random() * total;
  let sum = 0;
  for (const letter of letters) {
    sum += freqs[letter];
    if (rand < sum) {
      return letter;
    }
  }

  return letters[letters.length - 1];
}

// #endregion

// #region: Initial Player Tiles
export function generateTilesByFrequency(
  count = 10,
  seed?: number,
  vowelRatio = 0.4 // 40% vowels by default
): Record<string, number> {
  // Separate vowels and consonants
  const vowelLetters = Object.entries(frequencies)
    .filter(([letter]) => VOWELS.has(letter))
    .flatMap(([letter, freq]) => Array(freq).fill(letter));

  const consonantLetters = Object.entries(frequencies)
    .filter(([letter]) => !VOWELS.has(letter))
    .flatMap(([letter, freq]) => Array(freq).fill(letter));

  // Shuffle with seed if provided
  const shuffledVowels = seed
    ? shuffleWithSeed(vowelLetters, seed + 1)
    : shuffleArray(vowelLetters);

  const shuffledConsonants = seed
    ? shuffleWithSeed(consonantLetters, seed + 2)
    : shuffleArray(consonantLetters);

  // Calculate how many vowels and consonants to take
  const numVowels = Math.round(count * vowelRatio);
  const numConsonants = count - numVowels;

  // Pick tiles
  const chosenLetters = [
    ...shuffledVowels.slice(0, numVowels),
    ...shuffledConsonants.slice(0, numConsonants),
  ];

  // Shuffle final mix so vowels/consonants aren’t clumped
  const finalLetters = seed
    ? shuffleWithSeed(chosenLetters, seed + 3)
    : shuffleArray(chosenLetters);

  return arrayToTilePool(finalLetters);
}

// #endregion

// #region: Word Utilities

/**
 * Returns the length of the maximum overlap between the end of `prev` and the start of `curr`
 * @param prev The previous string
 * @param curr The current string
 * @returns The length of the overlap
 */
export function getOverlap(prev: string, curr: string): number {
  const maxLen = Math.min(prev.length, curr.length);
  for (let len = maxLen; len > 0; len--) {
    if (prev.slice(-len) === curr.slice(0, len)) return len;
  }
  return 0;
}

export function canBuildWord(
  word: string,
  tiles: TilePool,
  prevWord?: string
): boolean {
  const tilesCopy = { ...tiles };
  word = word.toUpperCase();

  let overlap = 0;
  if (prevWord) {
    prevWord = prevWord.toUpperCase();
    overlap = getOverlap(prevWord, word);
    if (overlap < 1) overlap = 0;
  }

  const suffix = word.slice(overlap);

  for (const char of suffix) {
    if (tilesCopy[char] && tilesCopy[char] > 0) {
      // Use the matching tile
      tilesCopy[char]--;
    } else if (tilesCopy[" "] && tilesCopy[" "] > 0) {
      // Use a blank tile as a wildcard
      tilesCopy[" "]--;
    } else {
      // No tile or blank available → cannot build
      return false;
    }
  }

  return true;
}

export function removeUsedLetters(
  word: string,
  tiles: TilePool,
  prevChainStr = ""
): TilePool {
  const tilesCopy = { ...tiles };
  word = word.toUpperCase();
  prevChainStr = prevChainStr.toUpperCase();

  const overlap = getOverlap(prevChainStr, word);
  const suffix = word.slice(overlap);

  for (const char of suffix) {
    if (tilesCopy[char] && tilesCopy[char] > 0) {
      tilesCopy[char]--;
      if (tilesCopy[char] === 0) delete tilesCopy[char];
    } else if (tilesCopy[" "] && tilesCopy[" "] > 0) {
      // Use a blank tile instead
      tilesCopy[" "]--;
      if (tilesCopy[" "] === 0) delete tilesCopy[" "];
    }
  }

  return tilesCopy;
}
// #endregion

// #region: Tile Pool Utilities

export function tilePoolToArray(tiles: TilePool): string[] {
  const arr: string[] = [];
  for (const [letter, count] of Object.entries(tiles)) {
    for (let i = 0; i < count; i++) arr.push(letter);
  }
  return arr;
}

export function arrayToTilePool(arr: string[]): TilePool {
  const pool: TilePool = {};
  for (const letter of arr) {
    pool[letter] = (pool[letter] || 0) + 1;
  }
  return pool;
}

export function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// #endregion

// #region: Daily Puzzle Utilities

export function getDailySeed(): number {
  const today = new Date();
  return Number(
    `${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}`
  );
}

export function shuffleWithSeed<T>(array: T[], seed: number): T[] {
  const result = [...array];
  let random = seed;

  function rand() {
    random = (random * 9301 + 49297) % 233280;
    return random / 233280;
  }

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

// #endregion
