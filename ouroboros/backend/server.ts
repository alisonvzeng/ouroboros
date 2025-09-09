import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { isValidWord } from "./utils/dictionary";

const app = express();
const PORT = 4000;

app.use(cors()); // allow requests from frontend
app.use(express.json());

let dictionary = new Set<string>();

// Load dictionary into memory once
const dictionaryPath = path.join(__dirname, "dictionary.txt");
try {
  const contents = fs.readFileSync(dictionaryPath, "utf-8");
  dictionary = new Set(contents.split("\n").map((w) => w.trim().toLowerCase()));
  console.log(`Loaded ${dictionary.size} words`);
} catch (err) {
  console.error("Failed to load dictionary:", err);
}

// API route
app.get("/api/check-word", (req, res) => {
  const word = (req.query.word as string)?.toLowerCase();
  if (!word) return res.status(400).json({ valid: false });

  const isValid = isValidWord(word);
  res.json({ valid: isValid });
});

// app.post("/api/check-playable", (req, res) => {
//   const { tiles, chain } = req.body;
//   if (!tiles || typeof tiles !== "object")
//     return res.status(400).json({ playable: false });

//   const playable = hasPlayableWords(tiles, (chain || "").toUpperCase());
//   res.json({ playable });
// });

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
