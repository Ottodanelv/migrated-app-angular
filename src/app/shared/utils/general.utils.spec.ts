/**
 * Unit tests for general utility functions.
 *
 * @module shared/utils/general.utils.spec
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
  debounce,
  deepClone,
  isEqual,
  groupBy,
  partition,
  unique,
  omit,
  pick,
} from './general.utils';

// ---------------------------------------------------------------------------
// debounce
// ---------------------------------------------------------------------------

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should debounce function calls', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    debounced();
    debounced();

    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should pass arguments to the debounced function', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced('test', 42);
    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledWith('test', 42);
  });

  it('should cancel pending execution', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    debounced.cancel();

    vi.advanceTimersByTime(100);
    expect(fn).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// deepClone
// ---------------------------------------------------------------------------

describe('deepClone', () => {
  it('should clone a plain object', () => {
    const original = { a: 1, b: 2 };
    const cloned = deepClone(original);
    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
  });

  it('should clone nested objects', () => {
    const original = { a: { b: { c: 3 } } };
    const cloned = deepClone(original);
    expect(cloned).toEqual(original);
    cloned.a.b.c = 4;
    expect(original.a.b.c).toBe(3);
  });

  it('should clone arrays', () => {
    const original = [1, [2, 3]];
    const cloned = deepClone(original);
    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned[1]).not.toBe(original[1]);
  });

  it('should handle null and undefined', () => {
    expect(deepClone(null)).toBeNull();
    expect(deepClone(undefined)).toBeUndefined();
  });

  it('should handle primitives', () => {
    expect(deepClone(42)).toBe(42);
    expect(deepClone('hello')).toBe('hello');
    expect(deepClone(true)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// isEqual
// ---------------------------------------------------------------------------

describe('isEqual', () => {
  it('should return true for identical primitives', () => {
    expect(isEqual(1, 1)).toBe(true);
    expect(isEqual('hello', 'hello')).toBe(true);
    expect(isEqual(true, true)).toBe(true);
  });

  it('should return false for different primitives', () => {
    expect(isEqual(1, 2)).toBe(false);
    expect(isEqual('hello', 'world')).toBe(false);
  });

  it('should return true for NaN', () => {
    expect(isEqual(NaN, NaN)).toBe(true);
  });

  it('should compare nested objects deeply', () => {
    expect(isEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })).toBe(true);
    expect(isEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 3 } })).toBe(false);
  });

  it('should compare arrays', () => {
    expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(isEqual([1, 2, 3], [1, 2, 4])).toBe(false);
    expect(isEqual([1, [2, 3]], [1, [2, 3]])).toBe(true);
  });

  it('should compare Dates', () => {
    expect(isEqual(new Date('2024-01-01'), new Date('2024-01-01'))).toBe(true);
    expect(isEqual(new Date('2024-01-01'), new Date('2024-02-01'))).toBe(false);
  });

  it('should compare Sets', () => {
    expect(isEqual(new Set([1, 2, 3]), new Set([1, 2, 3]))).toBe(true);
    expect(isEqual(new Set([1, 2, 3]), new Set([1, 2, 4]))).toBe(false);
  });

  it('should handle null and undefined', () => {
    expect(isEqual(null, null)).toBe(true);
    expect(isEqual(undefined, undefined)).toBe(true);
    expect(isEqual(null, undefined)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// groupBy
// ---------------------------------------------------------------------------

describe('groupBy', () => {
  it('should group elements by a key function', () => {
    const items = [
      { type: 'A', val: 1 },
      { type: 'B', val: 2 },
      { type: 'A', val: 3 },
    ];

    const result = groupBy(items, (item) => item.type);

    expect(result.get('A')).toHaveLength(2);
    expect(result.get('B')).toHaveLength(1);
    expect(result.get('A')?.[0].val).toBe(1);
    expect(result.get('A')?.[1].val).toBe(3);
  });

  it('should handle empty array', () => {
    const result = groupBy([], (item: unknown) => 'key');
    expect(result.size).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// partition
// ---------------------------------------------------------------------------

describe('partition', () => {
  it('should partition array based on predicate', () => {
    const [evens, odds] = partition([1, 2, 3, 4, 5], (n) => n % 2 === 0);
    expect(evens).toEqual([2, 4]);
    expect(odds).toEqual([1, 3, 5]);
  });

  it('should handle empty array', () => {
    const [pass, fail] = partition([], (n: number) => n > 0);
    expect(pass).toEqual([]);
    expect(fail).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// unique
// ---------------------------------------------------------------------------

describe('unique', () => {
  it('should remove duplicate primitives', () => {
    expect(unique([1, 2, 2, 3, 1])).toEqual([1, 2, 3]);
  });

  it('should use key function for objects', () => {
    const items = [{ id: 1 }, { id: 2 }, { id: 1 }];
    const result = unique(items, (item) => item.id);
    expect(result).toHaveLength(2);
  });

  it('should preserve order', () => {
    expect(unique([3, 1, 2, 1, 3])).toEqual([3, 1, 2]);
  });
});

// ---------------------------------------------------------------------------
// omit
// ---------------------------------------------------------------------------

describe('omit', () => {
  it('should omit specified keys', () => {
    const result = omit({ a: 1, b: 2, c: 3 }, ['b', 'c']);
    expect(result).toEqual({ a: 1 });
  });

  it('should not mutate the original object', () => {
    const original = { a: 1, b: 2 };
    const result = omit(original, ['b']);
    expect(original).toEqual({ a: 1, b: 2 });
    expect(result).toEqual({ a: 1 });
  });

  it('should handle omitting non-existent keys', () => {
    const result = omit({ a: 1 } as Record<string, unknown>, ['nonexistent' as string]);
    expect(result).toEqual({ a: 1 });
  });
});

// ---------------------------------------------------------------------------
// pick
// ---------------------------------------------------------------------------

describe('pick', () => {
  it('should pick specified keys', () => {
    const result = pick({ a: 1, b: 2, c: 3 }, ['a', 'c']);
    expect(result).toEqual({ a: 1, c: 3 });
  });

  it('should skip non-existent keys', () => {
    const result = pick({ a: 1 } as Record<string, unknown>, ['a', 'nonexistent' as string]);
    expect(result).toEqual({ a: 1 });
  });

  it('should not mutate the original object', () => {
    const original = { a: 1, b: 2 };
    const result = pick(original, ['a']);
    expect(original).toEqual({ a: 1, b: 2 });
  });
});
