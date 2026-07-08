/**
 * Validation utility functions migrated from legacy gestionWeb JS.
 *
 * Provides pure TypeScript validation helpers for Spanish tax identifiers (NIF/NIE),
 * phone numbers, financial amounts, and IBAN/account numbers.
 *
 * @source Legacy:
 *   - {@link .../gestionWeb/src/main/webapp/resources/js/generico/util.js} (esNIF, esNIE, calcularIban)
 *
 * @module shared/utils/validation.utils
 */

// ---------------------------------------------------------------------------
// Spanish Tax Identifier (NIF / NIE) Validation
// ---------------------------------------------------------------------------

/** Valid NIF letter table (map from remainder to letter). */
const NIF_LETTERS = 'TRWAGMYFPDXBNJZSQVHLCKE' as const;

/** Valid NIE prefix letters (X, Y, Z map to 0, 1, 2). */
const NIE_PREFIX_MAP: Record<string, string> = {
  X: '0',
  Y: '1',
  Z: '2',
} as const;

/** Regex: valid NIF format — 8 digits + uppercase letter. */
const NIF_REGEX = /^\d{8}[A-Z]$/;

/** Regex: valid NIE format — X/Y/Z + 7 digits + uppercase letter. */
const NIE_REGEX = /^[XYZ]\d{7}[A-Z]$/;

/** Regex: valid NIF format (lowercase letter also allowed). */
const NIF_REGEX_LOOSE = /^\d{8}[A-Za-z]$/;

/** Regex: valid NIE format (lowercase prefix/letter allowed). */
const NIE_REGEX_LOOSE = /^[XYZxyz]\d{7}[A-Za-z]$/;

/**
 * Checks whether a string starts with a numeric character (legacy esNIF logic).
 *
 * @param text - The string to check.
 * @returns True if the first character is a digit.
 *
 * @source Legacy: `cetelem.Util.esNIF()` — checks if text starts with a number.
 * @deprecated Use {@link isValidNif} for proper NIF validation.
 */
export function startsWithDigit(text: string): boolean {
  if (text.length === 0) return false;
  return !isNaN(parseInt(text.charAt(0), 10));
}

/**
 * Checks whether a string starts with a non-numeric character (legacy esNIE logic).
 *
 * @param text - The string to check.
 * @returns True if the first character is NOT a digit.
 *
 * @source Legacy: `cetelem.Util.esNIE()` — checks if text starts with a letter.
 * @deprecated Use {@link isValidNie} for proper NIE validation.
 */
export function startsWithLetter(text: string): boolean {
  if (text.length === 0) return false;
  return isNaN(parseInt(text.charAt(0), 10));
}

/**
 * Validates a Spanish NIF (Documento Nacional de Identidad).
 *
 * Format: 8 digits + control letter.
 * The control letter is calculated by taking the number modulo 23.
 *
 * @param nif - The NIF string to validate.
 * @returns True if the NIF is structurally valid and the control letter matches.
 *
 * @example
 * ```ts
 * isValidNif('12345678Z'); // true
 * isValidNif('12345678A'); // false (wrong control letter)
 * ```
 */
export function isValidNif(nif: string): boolean {
  if (!nif || !NIF_REGEX_LOOSE.test(nif)) {
    return false;
  }

  const normalizedNif = nif.toUpperCase();
  const digits = normalizedNif.substring(0, 8);
  const letter = normalizedNif.charAt(8);
  const expectedLetter = NIF_LETTERS.charAt(parseInt(digits, 10) % 23);

  return letter === expectedLetter;
}

/**
 * Validates a Spanish NIE (Número de Identidad de Extranjero).
 *
 * Format: X/Y/Z + 7 digits + control letter.
 * The prefix letter is substituted (X→0, Y→1, Z→2) before calculating the control.
 *
 * @param nie - The NIE string to validate.
 * @returns True if the NIE is structurally valid and the control letter matches.
 *
 * @example
 * ```ts
 * isValidNie('Z1234567M'); // true (Z maps to 2 → 21234567 % 23 = 14 → 'M')
 * ```
 *
 * @source Legacy: `cetelem.Util.esNIE()` (basic prefix check) + proper NIE algorithm.
 */
export function isValidNie(nie: string): boolean {
  if (!nie || !NIE_REGEX_LOOSE.test(nie)) {
    return false;
  }

  const normalizedNie = nie.toUpperCase();
  const prefix = normalizedNie.charAt(0);
  const mappedPrefix = NIE_PREFIX_MAP[prefix];

  if (!mappedPrefix) {
    return false;
  }

  const digits = normalizedNie.substring(1, 8);
  const letter = normalizedNie.charAt(8);
  const fullDigits = mappedPrefix + digits;
  const expectedLetter = NIF_LETTERS.charAt(parseInt(fullDigits, 10) % 23);

  return letter === expectedLetter;
}

/**
 * Validates either a NIF or NIE.
 *
 * @param id - The tax identifier string.
 * @returns True if the identifier is a valid NIF or NIE.
 *
 * @example
 * ```ts
 * isValidTaxId('12345678Z'); // true (valid NIF)
 * isValidTaxId('Z1234567M'); // true (valid NIE)
 * isValidTaxId('invalid'); // false
 * ```
 */
export function isValidTaxId(id: string): boolean {
  return isValidNif(id) || isValidNie(id);
}

// ---------------------------------------------------------------------------
// Phone Number Validation
// ---------------------------------------------------------------------------

/** Spanish mobile number prefixes (6xx, 7xx). */
const SPANISH_MOBILE_PREFIXES = ['6', '7'] as const;

/** Regex: basic Spanish phone number (9 digits, optional +34 prefix). */
const SPANISH_PHONE_REGEX = /^(\+34)?[679]\d{8}$/;

/**
 * Validates a Spanish phone number.
 *
 * Supports national (612345678) and international (+34612345678) formats.
 * Mobile numbers start with 6 or 7; landlines start with 9.
 *
 * @param phone - The phone number string.
 * @returns True if the phone number is a valid Spanish number.
 *
 * @example
 * ```ts
 * isValidPhone('612345678'); // true
 * isValidPhone('+34612345678'); // true
 * isValidPhone('1234'); // false
 * ```
 */
export function isValidPhone(phone: string): boolean {
  if (!phone) return false;

  const cleaned = phone.replace(/[\s\-()]/g, '');
  return SPANISH_PHONE_REGEX.test(cleaned);
}

/**
 * Checks whether a phone number is a Spanish mobile number (starts with 6 or 7).
 *
 * @param phone - The phone number string.
 * @returns True if it's a mobile number.
 *
 * @example
 * ```ts
 * isMobilePhone('612345678'); // true
 * isMobilePhone('912345678'); // false (landline)
 * ```
 */
export function isMobilePhone(phone: string): boolean {
  if (!isValidPhone(phone)) return false;

  const cleaned = phone.replace(/[\s\-()]/g, '').replace(/^\+34/, '');
  return SPANISH_MOBILE_PREFIXES.some((prefix) => cleaned.startsWith(prefix));
}

// ---------------------------------------------------------------------------
// Financial Amount Validation
// ---------------------------------------------------------------------------

/**
 * Validates that a numeric value is a positive amount (greater than zero).
 *
 * @param value - The amount to validate.
 * @returns True if the value is a finite number greater than 0.
 *
 * @example
 * ```ts
 * isPositiveAmount(100); // true
 * isPositiveAmount(0); // false
 * isPositiveAmount(-50); // false
 * ```
 */
export function isPositiveAmount(value: number): boolean {
  return typeof value === 'number' && isFinite(value) && value > 0;
}

/**
 * Validates that a value is within an allowed range for monetary amounts.
 *
 * @param value - The amount to validate.
 * @param min - Minimum allowed value (inclusive, default: 0).
 * @param max - Maximum allowed value (inclusive, default: Infinity).
 * @returns True if the amount is within the range.
 *
 * @example
 * ```ts
 * isAmountInRange(1000, 0, 10000); // true
 * isAmountInRange(50000, 0, 10000); // false
 * ```
 */
export function isAmountInRange(
  value: number,
  min: number = 0,
  max: number = Infinity,
): boolean {
  return typeof value === 'number' && isFinite(value) && value >= min && value <= max;
}

// ---------------------------------------------------------------------------
// IBAN / Bank Account Validation
// ---------------------------------------------------------------------------

/**
 * Performs a basic structural validation of an IBAN (International Bank Account Number).
 *
 * Validates the format and length for Spanish IBANs (ES + 22 digits).
 * For full validation, use a dedicated IBAN library or call a backend API.
 *
 * @param iban - The IBAN string to validate.
 * @returns True if the IBAN has a valid structure.
 *
 * @example
 * ```ts
 * isValidIban('ES6621000418401234567891'); // true (well-formed)
 * isValidIban('ES1234'); // false (too short)
 * ```
 */
export function isValidIban(iban: string): boolean {
  if (!iban) return false;

  const cleaned = iban.replace(/[\s\-]/g, '').toUpperCase();
  const ibanRegex = /^ES\d{22}$/;

  return ibanRegex.test(cleaned);
}

/**
 * Calculates the IBAN control digits for a Spanish account number.
 *
 * @source Legacy: `cetelem.Util.calcularIban()` — calculates ES + 2-digit control.
 *
 * @param cuenta - The 20-digit Spanish account number (CCC format: 4+4+2+10).
 * @returns The IBAN control string including 'ES' prefix (e.g., "ES12").
 *
 * @example
 * ```ts
 * calculateIbanControl('21000418401234567891'); // Returns IBAN prefix with control
 * ```
 */
export function calculateIbanControl(cuenta: string): string {
  const cleaned = cuenta.replace(/\D/g, '');

  if (cleaned.length !== 20) {
    return '';
  }

  // Spanish IBAN calculation: append '142800' (ES00 code) and compute mod 97
  const accountWithCode = cleaned + '142800';
  const part1 = accountWithCode.substring(0, 13);
  const part2 = accountWithCode.substring(13, 26);

  let resto = parseFloat(part1) % 97;
  const num2 = resto * 10000000000000 + parseFloat(part2);
  resto = num2 % 97;

  let dc = (98 - resto).toString();
  if (dc.length === 1) {
    dc = '0' + dc;
  }

  return 'ES' + dc;
}

/**
 * Validates a Spanish bank account number (CCC — Código Cuenta Cliente).
 *
 * Format: 20 digits (4 entity + 4 branch + 2 control + 10 account).
 *
 * @param cuenta - The bank account number (digits only or formatted).
 * @returns True if the account number has a valid length and structure.
 *
 * @example
 * ```ts
 * isValidCuenta('21000418401234567891'); // true
 * ```
 */
export function isValidCuenta(cuenta: string): boolean {
  if (!cuenta) return false;

  const cleaned = cuenta.replace(/\D/g, '');
  return cleaned.length === 20;
}
