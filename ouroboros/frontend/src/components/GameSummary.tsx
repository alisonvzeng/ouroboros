import React from "react";
import "../styles/GameSummary.css";

interface GameSummaryProps {
  score: number;
  playedWords: string[];
  onRestart: () => void;
  leftoverTiles: number;
}

export const GameSummary: React.FC<GameSummaryProps> = ({
  score,
  playedWords,
  onRestart,
  leftoverTiles,
}) => {
  return (
    <div className="game-summary-overlay">
      <div className="game-summary-container">
        <h2 className="game-summary-title">Game Over</h2>
        <p className="game-summary-text">
          Final Score: <span className="game-summary-mono">{score}</span>
        </p>
        <p className="game-summary-text">
          Leftover Tiles:{" "}
          <span className="game-summary-mono">{leftoverTiles}</span>
        </p>

        <div className="words-played-section">
          <h3 className="words-played-title">Words Played:</h3>
          <ul className="words-played-list">
            {playedWords.length > 0 ? (
              playedWords.map((word, i) => (
                <li key={i} className="words-played-item">
                  {word}
                </li>
              ))
            ) : (
              <li className="words-played-empty">No words played</li>
            )}
          </ul>
        </div>

        <button onClick={onRestart} className="restart-button">
          Play Again
        </button>
      </div>
    </div>
  );
};

export default GameSummary;
