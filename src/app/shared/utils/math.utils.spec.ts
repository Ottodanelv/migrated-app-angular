/**
 * Unit tests for math utility functions.
 *
 * @module shared/utils/math.utils.spec
 */

import { describe, it, expect } from 'vitest';

import {
  roundToCents,
  roundToDecimals,
  floorToCents,
  ceilToCents,
  calculateMonthlyPayment,
  calculateTotalInterest,
  calculateApr,
  calculatePercentage,
  applyPercentage,
  addPercentage,
  sum,
  average,
} from './math.utils';

// ---------------------------------------------------------------------------
// roundToCents
// ---------------------------------------------------------------------------

describe('roundToCents', () => {
  it('should round to 2 decimal places', () => {
    expect(roundToCents(123.456)).toBe(123.46);
    expect(roundToCents(123.454)).toBe(123.45);
  });

  it('should handle whole numbers', () => {
    expect(roundToCents(100)).toBe(100);
  });

  it('should handle small values', () => {
    expect(roundToCents(0.001)).toBe(0);
    expect(roundToCents(0.005)).toBe(0.01);
  });

  it('should handle floating-point precision edge cases', () => {
    // 1.005 * 100 = 100.499... without Number.EPSILON safeguard
    expect(roundToCents(1.005)).toBe(1.01);
    expect(roundToCents(2.005)).toBe(2.01);
    expect(roundToCents(3.005)).toBe(3.01);
  });

  it('should handle negative values', () => {
    expect(roundToCents(-123.456)).toBe(-123.46);
  });
});

// ---------------------------------------------------------------------------
// roundToDecimals
// ---------------------------------------------------------------------------

describe('roundToDecimals', () => {
  it('should round to specified decimals', () => {
    expect(roundToDecimals(123.4567, 3)).toBe(123.457);
    expect(roundToDecimals(123.4567, 0)).toBe(123);
  });

  it('should default to 2 decimals', () => {
    expect(roundToDecimals(123.456)).toBe(123.46);
  });
});

// ---------------------------------------------------------------------------
// floorToCents
// ---------------------------------------------------------------------------

describe('floorToCents', () => {
  it('should floor to 2 decimal places', () => {
    expect(floorToCents(123.456)).toBe(123.45);
    expect(floorToCents(123.999)).toBe(123.99);
  });

  it('should handle negative values', () => {
    expect(floorToCents(-123.456)).toBe(-123.46);
  });
});

// ---------------------------------------------------------------------------
// ceilToCents
// ---------------------------------------------------------------------------

describe('ceilToCents', () => {
  it('should ceil to 2 decimal places', () => {
    expect(ceilToCents(123.451)).toBe(123.46);
    expect(ceilToCents(123.001)).toBe(123.01);
  });

  it('should handle negative values', () => {
    expect(ceilToCents(-123.451)).toBe(-123.45);
  });
});

// ---------------------------------------------------------------------------
// calculateMonthlyPayment
// ---------------------------------------------------------------------------

describe('calculateMonthlyPayment', () => {
  it('should calculate the correct monthly payment', () => {
    // €10,000 at 5% APR for 24 months
    const payment = calculateMonthlyPayment(10000, 24, 0.05);
    // Expected: ~438.71
    expect(payment).toBeCloseTo(438.71, 1);
  });

  it('should handle zero interest rate', () => {
    const payment = calculateMonthlyPayment(1200, 12, 0);
    expect(payment).toBe(100);
  });

  it('should throw for invalid principal', () => {
    expect(() => calculateMonthlyPayment(0, 12, 0.05)).toThrow();
    expect(() => calculateMonthlyPayment(-100, 12, 0.05)).toThrow();
  });

  it('should throw for invalid months', () => {
    expect(() => calculateMonthlyPayment(10000, 0, 0.05)).toThrow();
    expect(() => calculateMonthlyPayment(10000, 1.5, 0.05)).toThrow();
  });

  it('should throw for negative interest rate', () => {
    expect(() => calculateMonthlyPayment(10000, 12, -0.05)).toThrow();
  });
});

// ---------------------------------------------------------------------------
// calculateTotalInterest
// ---------------------------------------------------------------------------

describe('calculateTotalInterest', () => {
  it('should calculate total interest for a loan', () => {
    const interest = calculateTotalInterest(10000, 24, 0.05);
    expect(interest).toBeGreaterThan(0);
    // Total paid = monthly * 24, minus principal
    expect(interest).toBeCloseTo(529.04, 0);
  });

  it('should return 0 for zero-interest loan', () => {
    const interest = calculateTotalInterest(10000, 12, 0);
    // With rounding, the total may be off by a few cents
    expect(Math.abs(interest)).toBeLessThanOrEqual(1);
  });
});

// ---------------------------------------------------------------------------
// calculateApr
// ---------------------------------------------------------------------------

describe('calculateApr', () => {
  it('should calculate APR from nominal rate', () => {
    const apr = calculateApr(0.05);
    // (1 + 0.05/12)^12 - 1 ≈ 0.05116...
    expect(apr).toBeCloseTo(0.0512, 3);
  });

  it('should return 0 for 0% rate', () => {
    expect(calculateApr(0)).toBe(0);
  });

  it('should throw for negative rate', () => {
    expect(() => calculateApr(-0.01)).toThrow();
  });
});

// ---------------------------------------------------------------------------
// calculatePercentage
// ---------------------------------------------------------------------------

describe('calculatePercentage', () => {
  it('should calculate what fraction part is of total', () => {
    expect(calculatePercentage(25, 100)).toBe(0.25);
    expect(calculatePercentage(1, 3)).toBeCloseTo(0.3333, 3);
  });

  it('should throw for zero or negative total', () => {
    expect(() => calculatePercentage(25, 0)).toThrow();
    expect(() => calculatePercentage(25, -100)).toThrow();
  });
});

// ---------------------------------------------------------------------------
// applyPercentage
// ---------------------------------------------------------------------------

describe('applyPercentage', () => {
  it('should apply a percentage to a base value', () => {
    expect(applyPercentage(1000, 0.21)).toBe(210);
    expect(applyPercentage(100, 0.5)).toBe(50);
  });

  it('should throw for non-finite base', () => {
    expect(() => applyPercentage(NaN, 0.5)).toThrow();
  });
});

// ---------------------------------------------------------------------------
// addPercentage
// ---------------------------------------------------------------------------

describe('addPercentage', () => {
  it('should add a percentage to a base value', () => {
    expect(addPercentage(1000, 0.21)).toBe(1210);
    expect(addPercentage(100, 0.1)).toBe(110);
  });
});

// ---------------------------------------------------------------------------
// sum
// ---------------------------------------------------------------------------

describe('sum', () => {
  it('should sum an array of numbers', () => {
    expect(sum([1, 2, 3, 4, 5])).toBe(15);
  });

  it('should sum an empty array to 0', () => {
    expect(sum([])).toBe(0);
  });

  it('should handle negative numbers', () => {
    expect(sum([-1, 1, -2, 2])).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// average
// ---------------------------------------------------------------------------

describe('average', () => {
  it('should calculate the average', () => {
    expect(average([10, 20, 30])).toBe(20);
    expect(average([1, 2, 3, 4, 5])).toBe(3);
  });

  it('should return 0 for empty array', () => {
    expect(average([])).toBe(0);
  });

  it('should handle single element', () => {
    expect(average([42])).toBe(42);
  });
});
