import { useState, useEffect } from "react";
import GamePage from "./pages/GamePage";
import Welcome from "./pages/Welcome";
import "./App.css";
import { getDailySeed } from "./utils/tiles";
// import { beginGame } from "./utils/beginGame";

function App() {
  const [started, setStarted] = useState(false);
  const [mode, setMode] = useState<"Daily Challenge" | "Endless">(
    "Daily Challenge"
  );
  const seed = getDailySeed();
  const [uid, setUid] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  return (
    <div>
      {!started ? (
        <Welcome
          modes={["Daily Challenge", "Endless"]}
          selectedMode={mode}
          setMode={setMode}
          onPlay={() => {
            setStarted(true);
            // beginGame({ mode, setMode, seed });
          }}
        />
      ) : (
        <GamePage
          mode={mode}
          setMode={setMode}
          setStarted={setStarted}
          seed={seed}
        />
      )}
    </div>
  );
}

export default App;
