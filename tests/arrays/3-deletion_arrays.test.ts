import { describe, expect, test } from "bun:test";
import {
  deleteAtEnd,
  deleteAtIndex,
  deleteAtStart,
} from "../../lessons/arrays/3-deletion_arrays";

describe("deleteAtEnd", () => {
  test("deletes last element of array", () => {
    const arr = [0, 2, 1, 4, 5]; // length = 5
    deleteAtEnd(arr);
    expect(arr).toEqual([0, 2, 1, 4]);
  });
});

describe("deleteAtStart", () => {
  test("deletes first element of array", () => {
    const arr = [0, 2, 1, 4, 5]; // length = 5
    deleteAtStart(arr);
    expect(arr).toEqual([2, 1, 4, 5]);
  });
});

describe("deleteAtIndex", () => {
  test("deletes element of array at given index", () => {
    const arr = [0, 2, 1, 4, 5]; // length = 5
    deleteAtIndex(arr, 2);
    expect(arr).toEqual([0, 2, 4, 5]);
  });
});
