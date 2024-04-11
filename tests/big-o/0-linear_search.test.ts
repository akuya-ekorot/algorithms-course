import linearSearch from '../../big-o/0-linear_search.ts';
import { describe, expect, test } from 'bun:test'

describe('linearSearch', () => {
  test('finds needle in haystack', () => {
    const hayStack = [0, 3, 1, 2, 6];
    expect(linearSearch(hayStack, 2)).toBe(3);
  });
});
