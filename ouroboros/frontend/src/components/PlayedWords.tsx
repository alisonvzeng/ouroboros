import React from "react";

interface PlayedWordsProps {
  words: string[];
}

export const PlayedWords: React.FC<PlayedWordsProps> = ({ words }) => {
  return (
    <ul className="words-played-list">
      {words.length > 0 ? (
        words.map((w, i) => (
          <li key={i} className="words-played-item">
            {w}
          </li>
        ))
      ) : (
        <li className="words-played-empty">No words played</li>
      )}
    </ul>
  );
};

export default PlayedWords;
