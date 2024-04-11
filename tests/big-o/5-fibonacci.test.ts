import { describe, expect, test } from "bun:test";
import fibonacci from "../../lessons/big-o/5-fibonacci";

describe("fibonacci", () => {
  test("returns 1st fibonacci number", () => {
    expect(fibonacci(1)).toBe(0);
  });

  test("returns 2nd fibonacci number", () => {
    expect(fibonacci(2)).toBe(1);
  });

  test("returns 4th fibonacci number", () => {
    expect(fibonacci(4)).toBe(2);
  });

  test("returns 10th fibonacci number", () => {
    expect(fibonacci(10)).toBe(34);
  });

  test("returns 100th fibonacci number", () => {
    expect(fibonacci(100)).toBe(34);
  });
});
