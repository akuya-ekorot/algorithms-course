import { describe, expect, test } from "bun:test";
import getElement from "../../lessons/big-o/4-get_element";

describe("getElement", () => {
  test("returns correct element", () => {
    const hayStack = [0, 2, 4, 6, 8];
    expect(getElement(hayStack, 2)).toBe(4);
  });

  test("returns -1", () => {
    const hayStack = [0, 2, 4, 6, 8];
    expect(getElement(hayStack, 5)).toBe(-1);
  });
});
