/**
 * returns the element at a given index from a list
 *
 * @param index the index of the element to get
 * @param hayStack the list of non-negative numbers to operate on
 *
 * @returns element at index, if element doesn't exist return -1
 */
export default function getElement(hayStack: number[], index: number): number {
  if (hayStack[index]) {
    return hayStack[index];
  } else {
    return -1;
  }
}
