export async function isValidWord(word: string): Promise<boolean> {
  if (!word) return false;

  try {
    const res = await fetch(
      `http://localhost:4000/api/check-word?word=${encodeURIComponent(word)}`
    );
    if (!res.ok) return false;
    const data = await res.json();
    return data.valid === true;
  } catch {
    return false;
  }
}
