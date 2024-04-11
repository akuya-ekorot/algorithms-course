/**
 * searches for duplicates in the list and returns the true if they exist
 * false if they don't
 *
 * @param hayStack List of numbers to search from
 * @returns true if there are duplicates, false otherwise
 * @complelxity O(n^2)
 */
export default function hasDuplicates(hayStack: number[]): boolean {
  for (let i = 0; i < hayStack.length; i++) {
    for (let j = 0; j < hayStack.length; j++) {
      if (hayStack[i] === hayStack[j] && i !== j && j > i) {
        return true;
      }
    }
  }
  return false;
}
