// import React from "react";
// import { initialTileBag } from "./tileBag";

// interface beginGameProps {
//   mode: "Daily Challenge" | "Endless";
//   setMode: React.Dispatch<React.SetStateAction<"Daily Challenge" | "Endless">>;
//   seed: number;
// }

// export function beginGame({
//   mode, setMode, seed,
// }: beginGameProps) {
//   // init props
//   setStarted(true);

//   const { tileBag: generatedTileBag, tiles: generatedTiles } = initialTileBag(
//     mode,
//     seed
//   );

//   setTileBag(generatedTileBag);
//   setTiles(generatedTiles);
//   setChain([]);
//   setScore(0);
//   setFeedback("");
//   setPlayedWords([]);
//   setLettersVisible(false);
// }
