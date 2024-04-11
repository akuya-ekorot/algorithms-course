import { describe, expect, test } from "bun:test";
import modifyList from "../../lessons/big-o/3-modify_list";

describe("modifyList", () => {
  test("multiplies all elements by needle", () => {
    const hayStack = [0, 2, 4, 6, 8];
    expect(modifyList(hayStack, 2)).toEqual([0, 4, 8, 12, 16]);
  });

  test("halves all elements", () => {
    const hayStack = [0, 2, 4, 6, 8];
    expect(modifyList(hayStack, 10)).toEqual([0, 1, 2, 3, 4]);
  });
});
