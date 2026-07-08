/**
 * General-purpose utility functions.
 *
 * Pure TypeScript helpers that don't belong to a specific domain:
 * deep cloning, debouncing, deep equality, and array helpers.
 *
 * @source Legacy:
 *   - {@link .../gestionWeb/src/main/webapp/resources/js/generico/util.js} (extend function)
 *
 * @module shared/utils/general.utils
 */

// ---------------------------------------------------------------------------
// Type Helpers
// ---------------------------------------------------------------------------

/** Generic function type for debounce. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => any;

/** A debounced function that also exposes a `cancel` method. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DebouncedFunction<T extends (...args: any[]) => any> = ((...args: Parameters<T>) => void) & { cancel: () => void };

// ---------------------------------------------------------------------------
// Debounce
// ---------------------------------------------------------------------------

/**
 * Creates a debounced function that delays invoking `fn` until after `ms`
 * milliseconds have elapsed since the last time the debounced function was invoked.
 *
 * @param fn - The function to debounce.
 * @param ms - The number of milliseconds to delay.
 * @returns A debounced function with a `cancel` method to cancel pending execution.
 *
 * @example
 * ```ts
 * const debouncedLog = debounce((msg: string) => console.log(msg), 300);
 * debouncedLog('hello');
 * debouncedLog('world'); // Only "world" is logged after 300ms
 * debouncedLog.cancel(); // Cancel pending execution
 * ```
 */
export function debounce<T extends AnyFunction>(
  fn: T,
  ms: number,
): DebouncedFunction<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const debounced = (...args: Parameters<T>): void => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = undefined;
    }, ms);
  };

  debounced.cancel = (): void => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  };

  return debounced as unknown as DebouncedFunction<T>;
}

// ---------------------------------------------------------------------------
// Deep Clone
// ---------------------------------------------------------------------------

/**
 * Creates a deep clone of a value using structured clone algorithm.
 *
 * Uses `structuredClone` when available (Node 17+, modern browsers),
 * falling back to JSON round-trip for simple serializable objects.
 *
 * @param obj - The value to clone.
 * @returns A deep clone of the input.
 *
 * @throws {Error} If the value cannot be cloned (contains functions, Symbols, etc.).
 *
 * @example
 * ```ts
 * const original = { a: 1, b: { c: 2 } };
 * const cloned = deepClone(original);
 * cloned.b.c = 3;
 * console.log(original.b.c); // 2 (unchanged)
 * ```
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;

  // Use structuredClone when available (modern environments)
  if (typeof structuredClone === 'function') {
    return structuredClone(obj);
  }

  // Fallback: JSON round-trip for serializable objects
  return JSON.parse(JSON.stringify(obj)) as T;
}

// ---------------------------------------------------------------------------
// Deep Equality
// ---------------------------------------------------------------------------

/**
 * Performs a deep equality comparison between two values.
 *
 * Compares primitives by value, objects/arrays by recursive key/value comparison.
 * Handles nested objects, arrays, Dates, RegExps, and Sets/Maps.
 *
 * @param a - First value.
 * @param b - Second value.
 * @returns True if the values are deeply equal.
 *
 * @example
 * ```ts
 * isEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } }); // true
 * isEqual([1, 2, 3], [1, 2, 3]); // true
 * isEqual(NaN, NaN); // true
 * ```
 */
export function isEqual(a: unknown, b: unknown): boolean {
  // Same reference or both NaN
  if (a === b || (Number.isNaN(a as number) && Number.isNaN(b as number))) return true;

  // If either is null/undefined (and not both, caught above)
  if (a == null || b == null) return false;

  // Handle Dates
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  // Handle RegExps
  if (a instanceof RegExp && b instanceof RegExp) {
    return a.source === b.source && a.flags === b.flags;
  }

  // Handle Sets
  if (a instanceof Set && b instanceof Set) {
    if (a.size !== b.size) return false;
    for (const item of a) {
      if (!b.has(item)) return false;
    }
    return true;
  }

  // Handle Maps
  if (a instanceof Map && b instanceof Map) {
    if (a.size !== b.size) return false;
    for (const [key, val] of a) {
      if (!b.has(key) || !isEqual(val, b.get(key))) return false;
    }
    return true;
  }

  // If types don't match
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object' || typeof b !== 'object') return false;

  // Handle arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!isEqual(a[i], b[i])) return false;
    }
    return true;
  }

  // If one is array and the other isn't
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  // Plain objects
  const keysA = Object.keys(a as Record<string, unknown>);
  const keysB = Object.keys(b as Record<string, unknown>);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (!isEqual(
      (a as Record<string, unknown>)[key],
      (b as Record<string, unknown>)[key],
    )) return false;
  }

  return true;
}

// ---------------------------------------------------------------------------
// Array Helpers
// ---------------------------------------------------------------------------

/**
 * Groups array elements by a key derived from each element.
 *
 * @param items - The array to group.
 * @param keyFn - A function that produces the group key for each element.
 * @returns A Map where keys are group identifiers and values are arrays of elements.
 *
 * @example
 * ```ts
 * const grouped = groupBy(
 *   [{ type: 'A', val: 1 }, { type: 'B', val: 2 }, { type: 'A', val: 3 }],
 *   (item) => item.type
 * );
 * // Map { 'A' => [{ type: 'A', val: 1 }, { type: 'A', val: 3 }], 'B' => [{ type: 'B', val: 2 }] }
 * ```
 */
export function groupBy<T, K extends string | number | symbol>(
  items: readonly T[],
  keyFn: (item: T, index: number) => K,
): Map<K, T[]> {
  const map = new Map<K, T[]>();

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const key = keyFn(item, i);
    const group = map.get(key);

    if (group) {
      group.push(item);
    } else {
      map.set(key, [item]);
    }
  }

  return map;
}

/**
 * Partitions an array into two arrays based on a predicate.
 *
 * @param items - The array to partition.
 * @param predicate - A function that returns true for elements to go into the first array.
 * @returns A tuple of [passing items, failing items].
 *
 * @example
 * ```ts
 * const [evens, odds] = partition([1, 2, 3, 4, 5], (n) => n % 2 === 0);
 * // evens = [2, 4], odds = [1, 3, 5]
 * ```
 */
export function partition<T>(
  items: readonly T[],
  predicate: (item: T, index: number) => boolean,
): [T[], T[]] {
  const pass: T[] = [];
  const fail: T[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (predicate(item, i)) {
      pass.push(item);
    } else {
      fail.push(item);
    }
  }

  return [pass, fail];
}

/**
 * Returns a new array with duplicate values removed, based on strict equality or an optional key function.
 *
 * @param items - The array to deduplicate.
 * @param keyFn - Optional function to produce a comparison key for each element.
 * @returns A new array with duplicates removed, preserving original order.
 *
 * @example
 * ```ts
 * unique([1, 2, 2, 3, 1]); // [1, 2, 3]
 * unique(
 *   [{ id: 1 }, { id: 2 }, { id: 1 }],
 *   (item) => item.id
 * ); // [{ id: 1 }, { id: 2 }]
 * ```
 */
export function unique<T>(
  items: readonly T[],
  keyFn?: (item: T) => unknown,
): T[] {
  const seen = new Set<unknown>();
  const result: T[] = [];

  for (const item of items) {
    const key = keyFn ? keyFn(item) : item;

    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Object Helpers
// ---------------------------------------------------------------------------

/**
 * Omits specified keys from an object, returning a new object.
 *
 * @param obj - The source object.
 * @param keys - Keys to omit.
 * @returns A new object without the specified keys.
 *
 * @example
 * ```ts
 * omit({ a: 1, b: 2, c: 3 }, ['b', 'c']); // { a: 1 }
 * ```
 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: readonly K[],
): Omit<T, K> {
  const result = { ...obj } as Record<string, unknown>;

  for (const key of keys) {
    delete result[key as string];
  }

  return result as Omit<T, K>;
}

/**
 * Picks specified keys from an object, returning a new object with only those keys.
 *
 * @param obj - The source object.
 * @param keys - Keys to pick.
 * @returns A new object containing only the specified keys.
 *
 * @example
 * ```ts
 * pick({ a: 1, b: 2, c: 3 }, ['a', 'c']); // { a: 1, c: 3 }
 * ```
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: readonly K[],
): Pick<T, K> {
  const result = {} as Pick<T, K>;

  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }

  return result;
}
