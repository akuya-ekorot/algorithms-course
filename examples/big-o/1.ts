/**
 * Add all numbers in an array
 * @param n Array of numbers
 *
 * @returns Sum of numbers in the array
 */
function addNumbers(n: number[]): number {
  let sum = 0;

  for (let i = 0; i < n.length; i++) {
    sum += n[i];
  }

  return sum;
}
