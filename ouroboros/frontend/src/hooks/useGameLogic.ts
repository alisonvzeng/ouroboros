import { useState } from "react";
import { set, z } from "zod";
import {
  generateTilesByFrequency,
  canBuildWord,
  removeUsedLetters,
  generateTileBag,
  tilePoolToArray,
  arrayToTilePool,
  shuffleArray,
  getDailySeed,
} from "../utils/tiles";
import { isValidWord } from "../utils/validWord";
import { getOverlap } from "../utils/overlap";
import type { TilePool } from "../utils/tiles";
import VALUES from "../data/values.json";

const valuesSchema = z.record(z.string(), z.number());
const seed = getDailySeed();
const TOTAL_SECTIONS = 20;

export function useGameLogic() {
  const [mode, setMode] = useState<"daily" | "endless">("daily");
  // For daily mode, you could use a fixed seed or deterministic generator
  const [tileBag, setTileBag] = useState<TilePool>(() =>
    mode === "daily" ? generateTileBag(10, seed) : generateTileBag(200)
  );

  const [tiles, setTiles] = useState<TilePool>(() =>
    mode === "daily"
      ? generateTilesByFrequency(10, seed)
      : generateTilesByFrequency(10)
  );
  const [chain, setChain] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string>("");

  const [displayLetters, setDisplayLetters] = useState<string[]>(chain);
  const [lettersVisible, setLettersVisible] = useState(true);

  const [playedWords, setPlayedWords] = useState<string[]>([]);

  const VOWELS = new Set(["A", "E", "I", "O", "U"]);

  const parsedValues = valuesSchema.safeParse(VALUES);
  if (!parsedValues.success) {
    throw new Error("Invalid letter values data");
  }
  const values = parsedValues.data;

  function restartGame() {
    setTileBag(
      mode === "daily" ? generateTileBag(50, seed) : generateTileBag(200)
    );
    setTiles(
      mode === "daily"
        ? generateTilesByFrequency(10, seed)
        : generateTilesByFrequency(10)
    );
    setChain([]);
    setScore(0);
    setFeedback("");
    setPlayedWords([]);
  }

  function updateMode(newMode: "daily" | "endless") {
    if (newMode === mode) return;
    setTileBag(
      newMode === "daily" ? generateTileBag(50, seed) : generateTileBag(200)
    );
    setTiles(
      newMode === "daily"
        ? generateTilesByFrequency(10, seed)
        : generateTilesByFrequency(10)
    );
    setChain([]);
    setScore(0);
    setFeedback("");
    setMode(newMode);
    setPlayedWords([]);
    setDisplayLetters([]);
  }

  function calculateScore(newWord: string) {
    const prevWord = chain.join("");
    const prevSet = new Set(prevWord.split(""));

    let baseScore = 0;
    let newTilesCount = 0;

    for (const char of newWord.toUpperCase()) {
      const letterScore = values[char] || 0;
      if (prevSet.has(char)) {
        baseScore += letterScore * 2; // reused letter
      } else {
        baseScore += letterScore;
        newTilesCount++;
      }
    }

    let multiplier = 1;
    if (newTilesCount >= 10) multiplier = 6;
    else if (newTilesCount >= 7) multiplier = 4;
    else if (newTilesCount >= 5) multiplier = 2;

    return baseScore * multiplier;
  }

  function alphabetizeTiles() {
    setTiles((prevTiles) => arrayToTilePool(tilePoolToArray(prevTiles).sort()));
  }

  function randomizeTiles() {
    setTiles((prevTiles) =>
      arrayToTilePool(shuffleArray(tilePoolToArray(prevTiles)))
    );
  }

  function drawTilesByType(count: number, type: "vowel" | "consonant") {
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

      setScore((s) => s - drawn.length); // Penalty for drawing tiles

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

  async function submitWord(word: string) {
    setFeedback("");
    word = word.toUpperCase();

    console.log("Submitting word:", word);

    if (!(await isValidWord(word))) {
      setFeedback(word + " is not a valid word.");
      return false;
    }

    const currentChainStr = chain.join("");
    const overlap = getOverlap(currentChainStr, word);
    const letterDiff = word.slice(overlap).split("");

    if (!canBuildWord(word, tiles, currentChainStr)) {
      setFeedback("Not enough tiles to build word.");
      return false;
    }

    if (chain.length > 0) {
      const lastWordLength = chain.length; // or length of the previous word if you store words separately
      const fullOverlap = overlap === Math.min(word.length, lastWordLength);

      if (overlap < 1) {
        setFeedback("No valid overlap with previous word.");
        return false;
      }

      if (fullOverlap) {
        setFeedback("Word fully overlaps the previous word.");
        return false;
      }
    }

    setLettersVisible(false);
    console.log("Hiding letters for animation");
    await new Promise((resolve) => setTimeout(resolve, 300));
    setDisplayLetters((old) => [...old, ...letterDiff]);

    setChain((oldChain) => [...oldChain, ...letterDiff]);

    setScore((s) => s + calculateScore(word));
    setTiles(removeUsedLetters(word, tiles, currentChainStr));

    setPlayedWords((prev) => [...prev, word]);

    // ✅ Draw a random letter from the bag after a valid submission
    setTileBag((prevBag) => {
      const newBag = { ...prevBag };
      const availableLetters = Object.keys(newBag).filter((l) => newBag[l] > 0);

      if (availableLetters.length > 0) {
        const idx = Math.floor(Math.random() * availableLetters.length);
        const letter = availableLetters[idx];

        // Remove from bag
        newBag[letter]--;

        // Add to tiles
        setTiles((prevTiles) => ({
          ...prevTiles,
          [letter]: (prevTiles[letter] || 0) + 1,
        }));
      }

      console.log(
        "Total tiles left in bag:",
        Object.values(newBag).reduce((sum, count) => sum + count, 0)
      );

      return newBag;
    });

    return true;
  }

  return {
    chain,
    score,
    tiles,
    submitWord,
    feedback,
    drawTilesByType,
    alphabetizeTiles,
    randomizeTiles,
    updateMode,
    tileBag,
    lettersVisible,
    setLettersVisible,
    playedWords,
    restartGame,
  };
}
