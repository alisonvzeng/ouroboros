import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { isValidWord } from "./utils/dictionary";
import { db } from "../backend/firebase/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

let dictionary = new Set<string>();

const dictionaryPath = path.join(__dirname, "dictionary.txt");
try {
  const contents = fs.readFileSync(dictionaryPath, "utf-8");
  dictionary = new Set(contents.split("\n").map((w) => w.trim().toLowerCase()));
  console.log(`Loaded ${dictionary.size} words`);
} catch (err) {
  console.error("Failed to load dictionary:", err);
}

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/api/check-word", (req, res) => {
  const word = (req.query.word as string)?.toLowerCase();
  if (!word) return res.status(400).json({ valid: false });

  const isValid = isValidWord(word);
  res.json({ valid: isValid });
});

app.post("/api/test-post", (req, res) => {
  console.log("Received data:", req.body);
  res.status(200).json({ success: true, id: "12345" });
});

app.post("/api/submit-game-data", async (req, res) => {
  console.log("Received game data submission request");
  console.log("Game data:", req.body);

  const gameDataRef = collection(db, "gameData");
  const gameDataBody = req.body;

  try {
    const docRef = await addDoc(gameDataRef, gameDataBody);
    console.log("Game data received:", gameDataBody);
    console.log("Document written with ID: ", docRef.id);
    res.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error("Error adding document: ", error);
    res.status(500).json({ success: false, error: "Failed to save game data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
