import { useState } from "react";
import GamePage from "./pages/GamePage";
import Welcome from "./components/Welcome";
import "./App.css";

function App() {
  const [started, setStarted] = useState(false);
  const [mode, setMode] = useState<"Daily Challenge" | "Endless">(
    "Daily Challenge"
  );

  return (
    <div>
      {!started ? (
        <Welcome
          modes={["Daily Challenge", "Endless"]}
          selectedMode={mode}
          setMode={setMode}
          onPlay={() => setStarted(true)}
        />
      ) : (
        <GamePage mode={mode} setMode={setMode} />
      )}
    </div>
  );
}

export default App;
