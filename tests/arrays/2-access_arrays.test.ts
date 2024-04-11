import { describe, expect, test } from "bun:test";
import { accessAtIndex } from "../../lessons/arrays/2-access_arrays";

describe("access at index", () => {
  test("accesses element", () => {
    const arr = [0, 5, 23, 5, 8];
    expect(accessAtIndex(arr, 3)).toBe(5);
  });

  test("element out of bound", () => {
    const arr = [0, 5, 23, 5, 8];
    expect(accessAtIndex(arr, 5)).toBe(-1);
  });
});
