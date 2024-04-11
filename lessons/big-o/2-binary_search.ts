/**
 * uses binary search to look for needle in hayStack
 *
 * @param needle number to search for in hayStack
 * @param hayStack list of numbers to search from
 * @param start start of list to check
 * @param end end of list to check
 *
 * @returns index of needle in hayStack, -1 if needle's not in hayStack
 * @complexity O(log n)
 */
export default function binarySearch(
  hayStack: number[],
  needle: number,
  start: number,
  end: number,
): number {
  if (start > end) {
    return -1;
  }

  const mid = Math.floor((start + end) / 2);

  if (hayStack[mid] === needle) {
    return mid;
  }

  if (needle > hayStack[mid]) {
    return binarySearch(hayStack, needle, mid + 1, end);
  } else {
    return binarySearch(hayStack, needle, start, mid - 1);
  }
}
