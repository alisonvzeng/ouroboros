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
import type { TilePool } from "../utils/tiles";
import { submitWord } from "../utils/submitWord";
import { resetGame } from "../utils/resetGame";
import {
  initialTileBag,
  alphabetizeTiles,
  randomizeTiles,
  drawTilesByType,
} from "../utils/tileBag";
import VALUES from "../data/values.json";

const valuesSchema = z.record(z.string(), z.number());
const seed = getDailySeed();
const TOTAL_SECTIONS = 20;
const VOWELS = new Set(["A", "E", "I", "O", "U"]);

export function useGameLogic(
  mode: "Daily Challenge" | "Endless",
  setMode: React.Dispatch<React.SetStateAction<"Daily Challenge" | "Endless">>,
  seed: number,
  setStarted: React.Dispatch<React.SetStateAction<boolean>>
) {
  const { tileBag: generatedTileBag, tiles: generatedTiles } = initialTileBag(
    mode,
    seed
  );
  const [tiles, setTiles] = useState<TilePool>(generatedTiles);
  const [tileBag, setTileBag] = useState<TilePool>(generatedTileBag);
  const [chain, setChain] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string>("");
  const [lettersVisible, setLettersVisible] = useState(true);
  const [playedWords, setPlayedWords] = useState<string[]>([]);

  // Validate VALUES data
  const parsedValues = valuesSchema.safeParse(VALUES);
  if (!parsedValues.success) {
    throw new Error("Invalid letter values data");
  }
  const values = parsedValues.data;

  function updateMode(newMode: "Daily Challenge" | "Endless") {
    if (newMode === mode) return;
    const { tileBag: generatedTileBag, tiles: generatedTiles } = initialTileBag(
      mode,
      seed
    );
    setTileBag(generatedTileBag);
    setTiles(generatedTiles);
    setChain([]);
    setScore(0);
    setFeedback("");
    setMode(newMode);
    setPlayedWords([]);
    setLettersVisible(false);
  }

  return {
    chain,
    setChain,
    score,
    setScore,
    tiles,
    setTiles,
    feedback,
    setFeedback,
    values,
    drawTilesByType,
    alphabetizeTiles,
    randomizeTiles,
    updateMode,
    tileBag,
    setTileBag,
    lettersVisible,
    setLettersVisible,
    playedWords,
    setPlayedWords,
    resetGame,
  };
}
