/**
 * search for an element and return it's index
 * if the element doesn't exist, return -1
 *
 * @param hayStack list of numbers to search
 * @param needle Number to look for
 *
 * @returns index of needle in hayStack, -1 otherwise
 * @complexity O(n)
 */
export default function linearSearch(hayStack: number[], needle: number) {
  for (let i = 0; i < hayStack.length; i++) {
    if (hayStack[i] === needle) {
      return i;
    }
  }
  return -1;
}
