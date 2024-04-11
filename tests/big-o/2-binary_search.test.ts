import { describe, expect, test } from "bun:test";
import binarySearch from "../../lessons/big-o/2-binary_search";

describe("binarySearch", () => {
  test("finds needle in haystack", () => {
    const hayStack = [0, 1, 2, 3, 6];
    expect(binarySearch(hayStack, 2, 0, hayStack.length - 1)).toBe(2);
  });

  test("finds needle in haystack", () => {
    const hayStack = [0, 2, 4, 6, 12];
    expect(binarySearch(hayStack, 6, 0, hayStack.length - 1)).toBe(3);
  });

  test("doesn't find needle in haystack", () => {
    const hayStack = [0, 2, 4, 6, 12];
    expect(binarySearch(hayStack, 3, 0, hayStack.length - 1)).toBe(-1);
  });
});
