import { describe, expect, test } from "bun:test";
import linearSearch from "../../lessons/big-o/0-linear_search";

describe("linearSearch", () => {
  test("finds needle in haystack", () => {
    const hayStack = [0, 3, 1, 2, 6];
    expect(linearSearch(hayStack, 2)).toBe(3);
  });
});
