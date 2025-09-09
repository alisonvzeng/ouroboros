import { useState } from "react";
import { useGameLogic } from "../hooks/useGameLogic";
import TilesDisplay from "../components/TilesDisplay";
import TilesLeft from "../components/TilesLeft";
import Timer from "../components/Timer";
import Snake from "../components/Snake";
import GameSummary from "../components/GameSummary";
import PlayedWords from "../components/PlayedWords";
import { submitWord } from "../utils/submitWord";
import "../styles/GamePage.css";

interface GamePageProps {
  mode: "Daily Challenge" | "Endless";
  setMode: React.Dispatch<React.SetStateAction<"Daily Challenge" | "Endless">>;
}

export default function GamePage({ mode, setMode }: GamePageProps) {
  const {
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
    restartGame,
  } = useGameLogic(mode, setMode);

  const [word, setWord] = useState("");
  const [input, setInput] = useState("");
  const [resetCounter, setResetCounter] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const success = await submitWord(
      input,
      setFeedback,
      chain,
      setChain,
      tiles,
      setTiles,
      score,
      setScore,
      values,
      playedWords,
      setPlayedWords,
      setLettersVisible,
      tileBag,
      setTileBag
    );
    if (success) {
      setWord(input);
      setInput("");
    }
  }

  return (
    <div className="game-page">
      <h1 className="game-title">Ouroboros</h1>

      {/* Mode Selector */}
      {/* <div className="mode-selector">
        <label className="mode-label">Mode:</label>
        <select
          onChange={(e) => {
            setResetCounter((prev) => prev + 1);
            updateMode(e.target.value as "Daily Challenge" | "Endless");
          }}
          className="mode-dropdown"
        >
          <option value="Daily Challenge">Daily Challenge</option>
          <option value="Endless">Endless</option>
        </select>
      </div> */}

      <p className="score">Score: {score}</p>
      <Timer resetTrigger={resetCounter} />

      {/* Centered Panes */}
      <div className="panes">
        {/* Left Pane */}
        <div className="pane">
          <TilesDisplay tiles={tiles} />
          <TilesLeft tileBag={tileBag} />

          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                drawTilesByType(2, "vowel", setTileBag, setTiles);
                setScore((s) => s - 2);
              }}
              className="btn btn-vowel"
            >
              Draw Vowel
            </button>
            <button
              onClick={() => {
                drawTilesByType(2, "consonant", setTileBag, setTiles);
                setScore((s) => s - 2);
              }}
              className="btn btn-consonant"
            >
              Draw Consonant
            </button>
            <button
              className="btn btn-alphabetize"
              onClick={() => alphabetizeTiles(setTiles)}
            >
              Alphabetize
            </button>
            <button
              className="btn btn-randomize"
              onClick={() => randomizeTiles(setTiles)}
            >
              Randomize
            </button>
          </div>
        </div>

        {/* Middle Pane */}
        <div className="middle-pane">
          <Snake
            letters={chain}
            word={word}
            lettersVisible={lettersVisible}
            setLettersVisible={setLettersVisible}
          />

          <form onSubmit={handleSubmit} className="word-form">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="word-input"
            />
            <button className="btn btn-consonant">Submit</button>
            {feedback && <p className="feedback">{feedback}</p>}
          </form>
        </div>

        {/* Right Pane */}
        <div className="pane">
          <p className="text-lg font-semibold">Score: {score}</p>
          <div className="played-words-container">
            <h3 className="played-words-title">Played Words</h3>
            <PlayedWords words={playedWords} />
          </div>
          <button onClick={() => setGameOver(true)} className="btn btn-end">
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
