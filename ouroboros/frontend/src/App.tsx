import { useState } from "react";
import GamePage from "./pages/GamePage";
import LetterCircle from "./components/LetterCircle";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <GamePage />
    </div>
  );
}

export default App;
