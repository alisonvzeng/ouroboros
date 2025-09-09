import { useState } from "react";

export function useGameMode(initialMode: "daily" | "endless") {
  const [mode, setMode] = useState<"daily" | "endless">(initialMode);

  function updateMode(newMode: "daily" | "endless") {
    setMode(newMode);
  }

  return { mode, updateMode };
}
