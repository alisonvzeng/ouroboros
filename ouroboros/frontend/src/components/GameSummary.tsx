import React from "react";

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
    <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">Game Over</h2>
        <p className="text-lg mb-4">
          Final Score: <span className="font-mono">{score}</span>
        </p>
        <p className="text-lg mb-4">
          Leftover Tiles: <span className="font-mono">{leftoverTiles}</span>
        </p>

        <div className="w-full mb-4">
          <h3 className="text-lg font-semibold mb-2">Words Played:</h3>
          <ul className="max-h-48 overflow-y-auto border rounded p-2">
            {playedWords.length > 0 ? (
              playedWords.map((word, i) => (
                <li key={i} className="text-gray-800">
                  {word}
                </li>
              ))
            ) : (
              <li className="text-gray-500 italic">No words played</li>
            )}
          </ul>
        </div>

        <button
          onClick={onRestart}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default GameSummary;
