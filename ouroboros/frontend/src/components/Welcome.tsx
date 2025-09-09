import React, { type Dispatch } from "react";
import "../styles/Welcome.css";

type WelcomeProps = {
  modes: ("Daily Challenge" | "Endless")[];
  selectedMode: "Daily Challenge" | "Endless";
  setMode: Dispatch<React.SetStateAction<"Daily Challenge" | "Endless">>;
  onPlay: () => void;
};

export default function Welcome({
  modes,
  selectedMode,
  setMode,
  onPlay,
}: WelcomeProps) {
  return (
    <div className="welcome-container">
      <h1 className="welcome-title">Ouroboros</h1>

      <div className="welcome-modes">
        {modes.map((mode) => (
          <button
            key={mode}
            className={`welcome-mode-btn ${
              selectedMode === mode ? "active" : ""
            }`}
            onClick={() => {
              setMode(mode);
            }}
          >
            {mode}
          </button>
        ))}
      </div>

      <button className="welcome-play" onClick={onPlay}>
        Play
      </button>
    </div>
  );
}
