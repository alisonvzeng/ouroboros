import fs from "fs";
import path from "path";
// import { canBuildWord } from "./tiles";

let dictionaryWords: Set<string> | null = null;

export function loadDictionary() {
  if (!dictionaryWords) {
    const dictionaryPath = path.join(__dirname, "../dictionary.txt");
    const fileContents = fs.readFileSync(dictionaryPath, "utf-8");
    dictionaryWords = new Set(
      fileContents.split("\n").map((w) => w.trim().toUpperCase())
    );
  }
  return dictionaryWords;
}

export function isValidWord(word: string): boolean {
  const words = loadDictionary();
  return words.has(word.toUpperCase());
}

// export function hasPlayableWords(
//   tiles: Record<string, number>,
//   currentChainStr = ""
// ): boolean {
//   const words = loadDictionary();

//   for (const word of words) {
//     if (canBuildWord(word, tiles, currentChainStr)) {
//       return true;
//     }
//   }

//   return false;
// }
