import { describe, expect, test } from "bun:test";
import hasDuplicates from "../../lessons/big-o/1-has_duplicates";

describe("hasDuplicates", () => {
  test("finds duplicate element", () => {
    const hayStack = [0, 4, 3, 2, 5, 4];
    expect(hasDuplicates(hayStack)).toBeTrue();
  });

  test("does't find duplicate elements", () => {
    const hayStack = [0, 4, 3, 2, 5];
    expect(hasDuplicates(hayStack)).toBeFalse();
  });
});
