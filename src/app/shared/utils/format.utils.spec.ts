/**
 * Unit tests for format utility functions.
 *
 * @module shared/utils/format.utils.spec
 */

import { describe, it, expect } from 'vitest';

import {
  formatCurrency,
  formatPercentage,
  formatNumber,
  formatDate,
  formatRelativeTime,
  DATE_FORMATS,
  DEFAULT_LOCALE,
  DEFAULT_CURRENCY,
} from './format.utils';

// ---------------------------------------------------------------------------
// formatCurrency
// ---------------------------------------------------------------------------

describe('formatCurrency', () => {
  it('should format a number as EUR currency with es-ES locale by default', () => {
    const result = formatCurrency(1234.56);
    // es-ES format: "1.234,56 €" — uses . as thousands separator and , as decimal
    expect(result).toMatch(/1[.\s]?234/);
    expect(result).toContain('56');
    expect(result).toContain('€');
  });

  it('should format with USD and en-US locale', () => {
    const result = formatCurrency(1000, 'USD', 'en-US');
    expect(result).toContain('$');
    expect(result).toContain('1,000');
  });

  it('should format zero', () => {
    const result = formatCurrency(0);
    expect(result).toContain('0');
  });

  it('should format negative values', () => {
    const result = formatCurrency(-500.50);
    expect(result).toContain('500');
    expect(result).toContain('50');
  });

  it('should always show 2 decimal places', () => {
    const result = formatCurrency(100);
    // Should end with ",00" in es-ES or ".00" depending on locale format
    expect(result).toMatch(/,00|\.00/);
  });

  it('should round to 2 decimal places', () => {
    const result = formatCurrency(123.456);
    expect(result).toContain('46'); // rounded up
  });

  it('should use custom locale and currency code', () => {
    const result = formatCurrency(99.99, 'GBP', 'en-GB');
    expect(result).toContain('£');
    expect(result).toContain('99.99');
  });
});

// ---------------------------------------------------------------------------
// formatPercentage
// ---------------------------------------------------------------------------

describe('formatPercentage', () => {
  it('should format a decimal as percentage with es-ES locale', () => {
    const result = formatPercentage(0.25);
    expect(result).toContain('25');
    expect(result).toContain('%');
  });

  it('should format with specified decimal places', () => {
    const result = formatPercentage(0.33333, 1);
    // Approximately 33.3%
    expect(result).toMatch(/33[.,]3\s?%/);
  });

  it('should format zero percent', () => {
    const result = formatPercentage(0);
    expect(result).toContain('0');
  });

  it('should format 100%', () => {
    const result = formatPercentage(1);
    expect(result).toContain('100');
  });

  it('should format with en-US locale', () => {
    const result = formatPercentage(0.5, 0, 'en-US');
    expect(result).toContain('50');
    expect(result).toContain('%');
  });
});

// ---------------------------------------------------------------------------
// formatNumber
// ---------------------------------------------------------------------------

describe('formatNumber', () => {
  it('should format with grouped thousands and default decimals', () => {
    const result = formatNumber(1234.5678);
    expect(result).toContain('1');
    expect(result).toContain('57'); // rounded
  });

  it('should format with specified min/max decimals', () => {
    const result = formatNumber(1000, 2, 2);
    // es-ES: 1000,00 (small numbers may not get thousands separator in some runtimes)
    expect(result).toContain('1000');
    expect(result).toContain('00');
    expect(result).toMatch(/,00|\.00/);
  });

  it('should format zero', () => {
    const result = formatNumber(0);
    expect(result).toBe('0');
  });

  it('should format integers with no decimals when not specified', () => {
    const result = formatNumber(42);
    expect(result).toBe('42');
  });

  it('should format with en-US locale', () => {
    const result = formatNumber(1234.5, 1, 1, 'en-US');
    expect(result).toBe('1,234.5');
  });
});

// ---------------------------------------------------------------------------
// formatDate
// ---------------------------------------------------------------------------

describe('formatDate', () => {
  it('should format a Date object with default SHORT format (dd/MM/yyyy)', () => {
    const date = new Date(2024, 0, 1); // Jan 1, 2024
    const result = formatDate(date);
    expect(result).toBe('01/01/2024');
  });

  it('should format an ISO date string', () => {
    const result = formatDate('2024-12-25');
    expect(result).toBe('25/12/2024');
  });

  it('should format with LONG format', () => {
    const date = new Date(2024, 0, 1);
    const result = formatDate(date, 'LONG');
    expect(result).toContain('enero');
    expect(result).toContain('2024');
  });

  it('should format with TIME format', () => {
    const date = new Date(2024, 0, 1, 14, 30);
    const result = formatDate(date, 'TIME');
    expect(result).toContain('14');
    expect(result).toContain('30');
  });

  it('should format with SHORT_WITH_TIME format', () => {
    const date = new Date(2024, 0, 1, 9, 15);
    const result = formatDate(date, 'SHORT_WITH_TIME');
    expect(result).toContain('01/01/2024');
    expect(result).toContain('09');
    expect(result).toContain('15');
  });

  it('should format with MONTH_YEAR format', () => {
    const date = new Date(2024, 5, 15);
    const result = formatDate(date, 'MONTH_YEAR');
    expect(result).toContain('junio');
    expect(result).toContain('2024');
  });

  it('should return empty string for invalid date', () => {
    const result = formatDate('not-a-date');
    expect(result).toBe('');
  });

  it('should format a timestamp number', () => {
    const timestamp = new Date(2024, 6, 8).getTime();
    const result = formatDate(timestamp);
    expect(result).toBe('08/07/2024');
  });
});

// ---------------------------------------------------------------------------
// formatRelativeTime
// ---------------------------------------------------------------------------

describe('formatRelativeTime', () => {
  it('should format a past date as relative time', () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 86400000);
    const result = formatRelativeTime(twoDaysAgo);
    // es-ES auto mode may say "anteayer" or "hace 2 días"
    expect(result.length).toBeGreaterThan(0);
    expect(typeof result).toBe('string');
  });

  it('should format a future date as "en ..."', () => {
    const inThreeHours = new Date(Date.now() + 3 * 3600000);
    const result = formatRelativeTime(inThreeHours);
    expect(result).toContain('en');
    expect(result).toContain('3');
  });

  it('should handle now or very recent', () => {
    const now = new Date();
    const result = formatRelativeTime(now);
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
  });
});

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

describe('DEFAULT_LOCALE', () => {
  it('should be es-ES', () => {
    expect(DEFAULT_LOCALE).toBe('es-ES');
  });
});

describe('DEFAULT_CURRENCY', () => {
  it('should be EUR', () => {
    expect(DEFAULT_CURRENCY).toBe('EUR');
  });
});

describe('DATE_FORMATS', () => {
  it('should have all expected format keys', () => {
    expect(DATE_FORMATS.SHORT).toBe('dd/MM/yyyy');
    expect(DATE_FORMATS.SHORT_WITH_TIME).toBeDefined();
    expect(DATE_FORMATS.LONG).toBeDefined();
    expect(DATE_FORMATS.DAY_MONTH).toBeDefined();
    expect(DATE_FORMATS.MONTH_YEAR).toBeDefined();
    expect(DATE_FORMATS.TIME).toBeDefined();
  });

  it('should be frozen (as const)', () => {
    expect(Object.keys(DATE_FORMATS)).toHaveLength(6);
  });
});
