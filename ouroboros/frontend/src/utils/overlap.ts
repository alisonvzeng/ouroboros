/**
 * Returns the length of the maximum overlap between the end of `prev` and the start of `curr`
 * @param prev The previous string
 * @param curr The current string
 * @returns The length of the overlap
 */
export function getOverlap(prev: string, curr: string): number {
  const maxLen = Math.min(prev.length, curr.length);
  for (let len = maxLen; len > 0; len--) {
    if (prev.slice(-len) === curr.slice(0, len)) return len;
  }
  return 0;
}
