import { set } from "zod";
import type { TilePool } from "./tiles";

interface resetGameProps {
  mode: "Daily Challenge" | "Endless";
  setStarted: React.Dispatch<React.SetStateAction<boolean>>;
  tileBag: TilePool;
  setTileBag: React.Dispatch<React.SetStateAction<TilePool>>;
  tiles: Record<string, number>;
  setTiles: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  chain: string[];
  setChain: React.Dispatch<React.SetStateAction<string[]>>;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  setFeedback: React.Dispatch<React.SetStateAction<string>>;
  playedWords: string[];
  setPlayedWords: React.Dispatch<React.SetStateAction<string[]>>;
  setLettersVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

async function submitGameData(gameData: any) {
  const response = await fetch("http://localhost:4000/api/submit-game-data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(gameData),
  });

  const result = await response.json();
  console.log(result);
  // try {
  //   const response = await fetch("http://localhost:4000/api/submit-game-data", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(gameData),
  //   });

  //   console.log("Response status:", response.status);
  //   const result = await response.json();
  //   console.log("Raw response:", result);

  //   if (!result.success) {
  //     throw new Error(result.error || "Failed to submit game data");
  //   }
  //   console.log("Game data saved with ID:", result.id);
  //   return result;
  // } catch (err: any) {
  //   console.error("Error submitting game data:", err.message);
  //   throw err;
  // }
}

export async function resetGame({
  mode,
  setStarted,
  tileBag,
  setTileBag,
  tiles,
  setTiles,
  chain,
  setChain,
  score,
  setScore,
  setFeedback,
  playedWords,
  setPlayedWords,
  setLettersVisible,
}: resetGameProps) {
  // save current game state to db
  try {
    const result = await submitGameData({
      mode,
      tileBag,
      tiles,
      chain,
      score,
      playedWords,
    });
  } catch (error) {
    console.error("Error saving game state:", error);
  }

  // return to welcome screen
  setTileBag({});
  setTiles({});
  setChain([]);
  setScore(0);
  setFeedback("");
  setPlayedWords([]);
  setLettersVisible(false);
  setStarted(false);
}
