/**
 * Unit tests for string utility functions.
 *
 * @module shared/utils/string.utils.spec
 */

import { describe, it, expect } from 'vitest';

import {
  capitalize,
  capitalizeWords,
  truncate,
  escapeHtml,
  formatCodeRef,
  stripWhitespace,
  normalizeWhitespace,
  padZero,
} from './string.utils';

// ---------------------------------------------------------------------------
// capitalize
// ---------------------------------------------------------------------------

describe('capitalize', () => {
  it('should capitalize the first letter and lowercase the rest', () => {
    expect(capitalize('hello')).toBe('Hello');
    expect(capitalize('HELLO')).toBe('Hello');
    expect(capitalize('hELLO')).toBe('Hello');
  });

  it('should handle single character', () => {
    expect(capitalize('a')).toBe('A');
  });

  it('should handle empty string', () => {
    expect(capitalize('')).toBe('');
  });

  it('should handle strings with numbers', () => {
    expect(capitalize('123abc')).toBe('123abc');
  });
});

// ---------------------------------------------------------------------------
// capitalizeWords
// ---------------------------------------------------------------------------

describe('capitalizeWords', () => {
  it('should capitalize each word', () => {
    expect(capitalizeWords('hello world')).toBe('Hello World');
  });

  it('should handle all uppercase input', () => {
    expect(capitalizeWords('HELLO WORLD')).toBe('Hello World');
  });

  it('should handle single word', () => {
    expect(capitalizeWords('hello')).toBe('Hello');
  });

  it('should handle empty string', () => {
    expect(capitalizeWords('')).toBe('');
  });

  it('should handle multiple spaces', () => {
    expect(capitalizeWords('hello   world')).toBe('Hello   World');
  });
});

// ---------------------------------------------------------------------------
// truncate
// ---------------------------------------------------------------------------

describe('truncate', () => {
  it('should truncate strings longer than maxLength', () => {
    expect(truncate('Hello world', 8)).toBe('Hello...');
  });

  it('should not truncate strings within maxLength', () => {
    expect(truncate('Hello', 10)).toBe('Hello');
  });

  it('should use custom ellipsis', () => {
    expect(truncate('Hello world', 6, '…')).toBe('Hello…');
  });

  it('should handle empty string', () => {
    expect(truncate('', 5)).toBe('');
  });

  it('should handle maxLength shorter than ellipsis', () => {
    expect(truncate('Hello', 1)).toBe('H');
  });

  it('should handle exact length match', () => {
    expect(truncate('Hello', 5)).toBe('Hello');
  });
});

// ---------------------------------------------------------------------------
// escapeHtml
// ---------------------------------------------------------------------------

describe('escapeHtml', () => {
  it('should escape ampersands', () => {
    expect(escapeHtml('AT&T')).toBe('AT&amp;T');
  });

  it('should escape less-than and greater-than', () => {
    expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
  });

  it('should escape double quotes', () => {
    expect(escapeHtml('say "hello"')).toBe('say &quot;hello&quot;');
  });

  it('should escape single quotes', () => {
    expect(escapeHtml("it's")).toBe('it&#39;s');
  });

  it('should handle empty string', () => {
    expect(escapeHtml('')).toBe('');
  });

  it('should not affect strings without special characters', () => {
    expect(escapeHtml('Hello World')).toBe('Hello World');
  });

  it('should escape a full HTML snippet', () => {
    const input = '<a href="#" onclick="alert(\'xss\')">Click</a>';
    const output = escapeHtml(input);
    expect(output).not.toContain('<');
    expect(output).not.toContain('>');
    expect(output).not.toContain('"');
    expect(output).toContain('&lt;');
    expect(output).toContain('&gt;');
    expect(output).toContain('&quot;');
    expect(output).toContain('&#39;');
  });
});

// ---------------------------------------------------------------------------
// formatCodeRef
// ---------------------------------------------------------------------------

describe('formatCodeRef', () => {
  it('should wrap code with default single quotes', () => {
    expect(formatCodeRef('ERROR_001')).toBe("'ERROR_001'");
  });

  it('should wrap with custom delimiter on both sides', () => {
    // Same delimiter is applied to both sides: delimiter + code + delimiter
    expect(formatCodeRef('INFO', '[')).toBe('[INFO[');
    expect(formatCodeRef('INFO', '{')).toBe('{INFO{');
  });

  it('should handle empty string', () => {
    expect(formatCodeRef('')).toBe('');
  });
});

// ---------------------------------------------------------------------------
// stripWhitespace
// ---------------------------------------------------------------------------

describe('stripWhitespace', () => {
  it('should remove all whitespace', () => {
    expect(stripWhitespace('  hello  world  ')).toBe('helloworld');
  });

  it('should handle empty string', () => {
    expect(stripWhitespace('')).toBe('');
  });

  it('should handle tabs and newlines', () => {
    expect(stripWhitespace('a\tb\nc')).toBe('abc');
  });
});

// ---------------------------------------------------------------------------
// normalizeWhitespace
// ---------------------------------------------------------------------------

describe('normalizeWhitespace', () => {
  it('should trim and collapse multiple spaces', () => {
    expect(normalizeWhitespace('  hello   world  ')).toBe('hello world');
  });

  it('should handle empty string', () => {
    expect(normalizeWhitespace('')).toBe('');
  });
});

// ---------------------------------------------------------------------------
// padZero
// ---------------------------------------------------------------------------

describe('padZero', () => {
  it('should pad a single digit to 2 places', () => {
    expect(padZero(5)).toBe('05');
  });

  it('should pad to custom length', () => {
    expect(padZero(123, 5)).toBe('00123');
  });

  it('should not pad if length already matches', () => {
    expect(padZero(10)).toBe('10');
  });

  it('should not pad if longer than requested length', () => {
    expect(padZero(123, 2)).toBe('123');
  });
});
