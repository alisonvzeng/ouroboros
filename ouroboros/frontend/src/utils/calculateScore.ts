// utils/scoring.ts
export function calculateScore(
  word: string,
  chain: string[],
  values: Record<string, number>
) {
  const prevWord = chain.join("");
  const prevSet = new Set(prevWord.split(""));

  let baseScore = 0;
  let newTilesCount = 0;

  for (const char of word.toUpperCase()) {
    const letterScore = values[char] || 0;
    if (prevSet.has(char)) baseScore += letterScore * 2;
    else {
      baseScore += letterScore;
      newTilesCount++;
    }
  }

  let multiplier = 1;
  if (newTilesCount >= 10) multiplier = 6;
  else if (newTilesCount >= 7) multiplier = 4;
  else if (newTilesCount >= 5) multiplier = 2;

  return baseScore * multiplier;
}
