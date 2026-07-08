/**
 * Unit tests for validation utility functions.
 *
 * @module shared/utils/validation.utils.spec
 */

import { describe, it, expect } from 'vitest';

import {
  startsWithDigit,
  startsWithLetter,
  isValidNif,
  isValidNie,
  isValidTaxId,
  isValidPhone,
  isMobilePhone,
  isPositiveAmount,
  isAmountInRange,
  isValidIban,
  calculateIbanControl,
  isValidCuenta,
} from './validation.utils';

// ---------------------------------------------------------------------------
// startsWithDigit / startsWithLetter (legacy esNIF/esNIE)
// ---------------------------------------------------------------------------

describe('startsWithDigit', () => {
  it('should return true for strings starting with a digit', () => {
    expect(startsWithDigit('12345678A')).toBe(true);
    expect(startsWithDigit('0test')).toBe(true);
  });

  it('should return false for strings starting with a letter', () => {
    expect(startsWithDigit('A1234567')).toBe(false);
    expect(startsWithDigit('X1234567')).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(startsWithDigit('')).toBe(false);
  });
});

describe('startsWithLetter', () => {
  it('should return true for strings starting with a letter', () => {
    expect(startsWithLetter('X1234567')).toBe(true);
    expect(startsWithLetter('Y1234567')).toBe(true);
    expect(startsWithLetter('Z1234567')).toBe(true);
  });

  it('should return false for strings starting with a digit', () => {
    expect(startsWithLetter('12345678A')).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(startsWithLetter('')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// isValidNif
// ---------------------------------------------------------------------------

describe('isValidNif', () => {
  it('should return true for a valid NIF', () => {
    // 12345678 % 23 = 14 → NIF_LETTERS[14] = 'Z'
    expect(isValidNif('12345678Z')).toBe(true);
  });

  it('should return true for a valid NIF with lowercase letter', () => {
    expect(isValidNif('12345678z')).toBe(true);
  });

  it('should return false for invalid control letter', () => {
    expect(isValidNif('12345678A')).toBe(false);
  });

  it('should return false for too few digits', () => {
    expect(isValidNif('1234Z')).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(isValidNif('')).toBe(false);
  });

  it('should return false for nullish input', () => {
    expect(isValidNif(null as unknown as string)).toBe(false);
    expect(isValidNif(undefined as unknown as string)).toBe(false);
  });

  it('should return false for NIE passed to NIF validator', () => {
    // NIE has different format (X/Y/Z + 7 digits + letter)
    expect(isValidNif('X1234567M')).toBe(false);
  });

  it('should validate multiple known valid NIF test cases', () => {
    // Known valid test NIFs
    expect(isValidNif('00000000T')).toBe(true); // 0 % 23 = 0 → T
  });
});

// ---------------------------------------------------------------------------
// isValidNie
// ---------------------------------------------------------------------------

describe('isValidNie', () => {
  it('should return true for a valid NIE', () => {
    // Z maps to 2, so 21234567 → 21234567 % 23 = 1 → NIF_LETTERS[1] = 'R'
    expect(isValidNie('Z1234567R')).toBe(true);
  });

  it('should return true for X-prefix NIE', () => {
    // X maps to 0, so 01234567 → 1234567 % 23 = 19 → NIF_LETTERS[19] = 'L'
    expect(isValidNie('X1234567L')).toBe(true);
  });

  it('should return true for Y-prefix NIE', () => {
    // Y maps to 1, so 11234567 → 11234567 % 23 = 10 → NIF_LETTERS[10] = 'X'
    expect(isValidNie('Y1234567X')).toBe(true);
  });

  it('should return true for lowercase prefix', () => {
    expect(isValidNie('z1234567r')).toBe(true);
  });

  it('should return false for invalid control letter', () => {
    expect(isValidNie('Z1234567A')).toBe(false);
  });

  it('should return false for invalid prefix letter', () => {
    expect(isValidNie('A1234567M')).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(isValidNie('')).toBe(false);
  });

  it('should return false for NIF passed to NIE validator', () => {
    expect(isValidNie('12345678Z')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// isValidTaxId
// ---------------------------------------------------------------------------

describe('isValidTaxId', () => {
  it('should return true for a valid NIF', () => {
    expect(isValidTaxId('12345678Z')).toBe(true);
  });

  it('should return true for a valid NIE', () => {
    expect(isValidTaxId('Z1234567R')).toBe(true);
  });

  it('should return false for invalid identifier', () => {
    expect(isValidTaxId('invalid')).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(isValidTaxId('')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// isValidPhone
// ---------------------------------------------------------------------------

describe('isValidPhone', () => {
  it('should return true for a Spanish mobile number', () => {
    expect(isValidPhone('612345678')).toBe(true);
  });

  it('should return true with international prefix', () => {
    expect(isValidPhone('+34612345678')).toBe(true);
  });

  it('should return true for a landline number', () => {
    expect(isValidPhone('912345678')).toBe(true);
  });

  it('should handle numbers with spaces and dashes', () => {
    expect(isValidPhone('612 345 678')).toBe(true);
    expect(isValidPhone('612-345-678')).toBe(true);
  });

  it('should return false for too short numbers', () => {
    expect(isValidPhone('1234')).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(isValidPhone('')).toBe(false);
  });

  it('should return false for numbers with letters', () => {
    expect(isValidPhone('61234567A')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// isMobilePhone
// ---------------------------------------------------------------------------

describe('isMobilePhone', () => {
  it('should return true for a 6xx number', () => {
    expect(isMobilePhone('612345678')).toBe(true);
  });

  it('should return true for a 7xx number', () => {
    expect(isMobilePhone('712345678')).toBe(true);
  });

  it('should return false for a landline (9xx)', () => {
    expect(isMobilePhone('912345678')).toBe(false);
  });

  it('should return false for an invalid number', () => {
    expect(isMobilePhone('1234')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// isPositiveAmount
// ---------------------------------------------------------------------------

describe('isPositiveAmount', () => {
  it('should return true for positive amounts', () => {
    expect(isPositiveAmount(100)).toBe(true);
    expect(isPositiveAmount(0.01)).toBe(true);
  });

  it('should return false for zero', () => {
    expect(isPositiveAmount(0)).toBe(false);
  });

  it('should return false for negative amounts', () => {
    expect(isPositiveAmount(-50)).toBe(false);
  });

  it('should return false for NaN', () => {
    expect(isPositiveAmount(NaN)).toBe(false);
  });

  it('should return false for Infinity', () => {
    expect(isPositiveAmount(Infinity)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// isAmountInRange
// ---------------------------------------------------------------------------

describe('isAmountInRange', () => {
  it('should return true for amounts within range', () => {
    expect(isAmountInRange(500, 0, 1000)).toBe(true);
  });

  it('should return true for amounts at the boundary', () => {
    expect(isAmountInRange(0, 0, 1000)).toBe(true);
    expect(isAmountInRange(1000, 0, 1000)).toBe(true);
  });

  it('should return false for amounts over the maximum', () => {
    expect(isAmountInRange(1500, 0, 1000)).toBe(false);
  });

  it('should return false for negative values', () => {
    expect(isAmountInRange(-1)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// isValidIban
// ---------------------------------------------------------------------------

describe('isValidIban', () => {
  it('should return true for a structurally valid Spanish IBAN', () => {
    // 24 chars: ES + 22 digits
    expect(isValidIban('ES6621000418401234567891')).toBe(true);
  });

  it('should handle IBAN with spaces', () => {
    expect(isValidIban('ES66 2100 0418 4012 3456 7891')).toBe(true);
  });

  it('should reject non-Spanish IBANs', () => {
    // DE (Germany) IBAN would fail the ES regex
    expect(isValidIban('DE89370400440532013000')).toBe(false);
  });

  it('should reject too short IBAN', () => {
    expect(isValidIban('ES1234')).toBe(false);
  });

  it('should reject empty string', () => {
    expect(isValidIban('')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// calculateIbanControl
// ---------------------------------------------------------------------------

describe('calculateIbanControl', () => {
  it('should return the IBAN control digits for a valid account', () => {
    const result = calculateIbanControl('21000418401234567891');
    expect(result).toMatch(/^ES\d{2}$/);
  });

  it('should return empty string for non-20-digit account', () => {
    expect(calculateIbanControl('1234')).toBe('');
    expect(calculateIbanControl('')).toBe('');
  });

  it('should pad single-digit control with leading zero', () => {
    const result = calculateIbanControl('21000418401234567891');
    // Control should always be 2 characters
    expect(result.length).toBe(4); // 'ES' + 2 digits
  });
});

// ---------------------------------------------------------------------------
// isValidCuenta
// ---------------------------------------------------------------------------

describe('isValidCuenta', () => {
  it('should return true for a 20-digit account number', () => {
    expect(isValidCuenta('21000418401234567891')).toBe(true);
  });

  it('should handle formatted account numbers', () => {
    expect(isValidCuenta('2100 0418 40 1234567891')).toBe(true);
  });

  it('should return false for too short', () => {
    expect(isValidCuenta('1234')).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(isValidCuenta('')).toBe(false);
  });
});
