import { describe, expect, test } from "bun:test";
import fibonacci from "../../lessons/big-o/5-fibonacci";

describe("fibonacci", () => {
  test("returns 1st fibonacci number", () => {
    expect(fibonacci(1)).toBe(1);
  });

  test("returns 2nd fibonacci number", () => {
    expect(fibonacci(2)).toBe(1);
  });

  test("returns 3rd fibonacci number", () => {
    expect(fibonacci(3)).toBe(2);
  });

  test("returns 9th fibonacci number", () => {
    expect(fibonacci(9)).toBe(34);
  });

  test("returns 99th fibonacci number", () => {
    expect(fibonacci(99)).toBe(34);
  });
});
