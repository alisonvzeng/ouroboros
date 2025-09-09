import { useState } from "react";
import { useGameLogic } from "../hooks/useGameLogic";
import LetterCircle from "../components/LetterCircle";
import TilesDisplay from "../components/TilesDisplay";
import TilesLeft from "../components/TilesLeft";
import Timer from "../components/Timer";
import Snake from "../components/Snake";
import GameSummary from "../components/GameSummary";

export default function GamePage() {
  const {
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
  } = useGameLogic();

  const [word, setWord] = useState("");
  const [input, setInput] = useState("");
  const [resetCounter, setResetCounter] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const success = await submitWord(input);
    if (success) {
      setWord(input);
      setInput("");
    }
  }

  return (
    <div className="p-4 h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-4 text-center">Ouroboros</h1>
      {/* Mode Selector */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Mode:</label>
        <select
          onChange={(e) => {
            setResetCounter((prev) => prev + 1);
            updateMode(e.target.value as "daily" | "endless");
          }}
          className="border px-2 py-1 rounded"
        >
          <option value="daily">Daily Puzzle</option>
          <option value="endless">Endless</option>
        </select>
      </div>

      <p className="mb-4">Score: {score}</p>
      <Timer resetTrigger={resetCounter} />

      {/* Centered Panes */}
      <div className="flex gap-8 ">
        {/* Left Pane */}
        <div className="flex flex-col gap-4 w-64">
          <TilesDisplay tiles={tiles} />
          <TilesLeft tileBag={tileBag} />

          <div className="flex flex-col gap-2">
            <button
              onClick={() => drawTilesByType(2, "vowel")}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Draw Vowel
            </button>
            <button
              onClick={() => drawTilesByType(2, "consonant")}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Draw Consonant
            </button>
            <button
              className="bg-yellow-500 text-white px-3 py-1 rounded"
              onClick={alphabetizeTiles}
            >
              Alphabetize
            </button>
            <button
              className="bg-purple-500 text-white px-3 py-1 rounded"
              onClick={randomizeTiles}
            >
              Randomize
            </button>
          </div>
        </div>

        {/* Middle Pane */}
        <div className="flex flex-col items-center">
          <Snake
            letters={chain}
            word={word}
            lettersVisible={lettersVisible}
            setLettersVisible={setLettersVisible}
          />

          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="border px-2 py-1 rounded"
            />
            <button className="bg-green-500 text-white px-3 py-1 rounded">
              Submit
            </button>
            {feedback && <p className="text-red-600">{feedback}</p>}
          </form>
        </div>

        {/* Right Pane */}
        <div className="flex flex-col gap-4 w-64">
          <p className="text-lg font-semibold">Score: {score}</p>
          <div className="flex-1 overflow-y-auto border rounded p-2 h-80">
            <h3 className="font-semibold mb-2">Played Words</h3>
            <ul>
              {playedWords.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
          <button
            onClick={() => setGameOver(true)}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            End Game
          </button>
        </div>
      </div>

      {/* Game Summary */}
      {gameOver && (
        <GameSummary
          score={score}
          playedWords={playedWords}
          onRestart={() => {
            restartGame();
            setGameOver(false);
          }}
          leftoverTiles={Object.values(tiles).reduce((a, b) => a + b, 0)}
        />
      )}
    </div>
  );
}
