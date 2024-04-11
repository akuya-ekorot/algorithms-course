import { describe, expect, test } from "bun:test";
import {
  insertAtEnd,
  insertAtIndex,
  insertAtStart,
} from "../../lessons/arrays/1-insertion_arrays";

describe("insertAtEnd", () => {
  test("inserts at end of array", () => {
    const arr = [1, 3, 2, 5, 6];
    insertAtEnd(arr, 8);
    expect(arr).toEqual([1, 3, 2, 5, 6, 8]);
  });
});

describe("insertAtStart", () => {
  test("inserts at start of array", () => {
    const arr = [1, 3, 2, 5, 6];
    insertAtStart(arr, 8);
    expect(arr).toEqual([8, 1, 3, 2, 5, 6]);
  });
});
