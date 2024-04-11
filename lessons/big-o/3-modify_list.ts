/**
 * if needle exists in hayStack, multiply every number in hayStack with needle
 * otherwise, divide every element by 2
 *
 * @param needle Number to look for in hayStack
 * @param hayStack list to modify
 *
 * @returns modified list
 * @complexity O(n)
 */
export default function modifyList(
  hayStack: number[],
  needle: number,
): number[] {
  let foundNeedle: boolean = false;

  for (let i = 0; i < hayStack.length; i++) {
    if (hayStack[i] === needle) {
      foundNeedle = true;
    }
  }

  for (let i = 0; i < hayStack.length; i++) {
    if (foundNeedle) {
      hayStack[i] = hayStack[i] * needle;
    } else {
      hayStack[i] = hayStack[i] / 2;
    }
  }

  return hayStack;
}
