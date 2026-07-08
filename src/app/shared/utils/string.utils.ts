/**
 * String manipulation utility functions.
 *
 * Pure TypeScript helpers for common string operations: capitalization,
 * truncation, HTML sanitization, and code reference formatting.
 *
 * @module shared/utils/string.utils
 */

// ---------------------------------------------------------------------------
// Capitalization
// ---------------------------------------------------------------------------

/**
 * Capitalizes the first character of a string and lowercases the rest.
 *
 * @param str - The input string.
 * @returns The capitalized string, or empty string if input is empty.
 *
 * @example
 * ```ts
 * capitalize('hello'); // "Hello"
 * capitalize('HELLO'); // "Hello"
 * capitalize(''); // ""
 * ```
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Capitalizes the first character of each word in a string (title case).
 *
 * Words are separated by spaces. Each word gets its first character uppercased
 * and the rest lowercased.
 *
 * @param str - The input string.
 * @returns The title-cased string.
 *
 * @example
 * ```ts
 * capitalizeWords('hello world'); // "Hello World"
 * capitalizeWords('HELLO WORLD'); // "Hello World"
 * ```
 *
 * Angular equivalent: `TitleCasePipe` — use `{{ value | titlecase }}` in templates.
 */
export function capitalizeWords(str: string): string {
  if (!str) return '';
  return str
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
}

// ---------------------------------------------------------------------------
// Truncation
// ---------------------------------------------------------------------------

/**
 * Truncates a string to a maximum length, appending an ellipsis if truncated.
 *
 * @param str - The input string.
 * @param maxLength - Maximum allowed length including the ellipsis (must be >= 3).
 * @param ellipsis - The truncation indicator (default: '...').
 * @returns The truncated string with ellipsis appended, or the original if shorter.
 *
 * @example
 * ```ts
 * truncate('Hello world', 8); // "Hello..."
 * truncate('Hello', 10); // "Hello"
 * truncate('Hello world', 5, '…'); // "Hello…"
 * ```
 */
export function truncate(
  str: string,
  maxLength: number,
  ellipsis: string = '...',
): string {
  if (!str) return '';
  if (maxLength < ellipsis.length) {
    return str.slice(0, maxLength);
  }
  if (str.length <= maxLength) return str;

  const truncateAt = maxLength - ellipsis.length;
  return str.slice(0, truncateAt) + ellipsis;
}

// ---------------------------------------------------------------------------
// HTML Sanitization
// ---------------------------------------------------------------------------

/**
 * HTML entity map for escaping.
 */
const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/**
 * Regex matching HTML special characters.
 */
const HTML_SPECIAL_CHARS_REGEX = /[&<>"']/g;

/**
 * Escapes HTML special characters to their entity equivalents.
 *
 * Converts `&`, `<`, `>`, `"`, and `'` to their HTML entity representations
 * to prevent XSS and ensure safe rendering of user-generated content.
 *
 * @param str - The input string containing potential HTML.
 * @returns The escaped string safe for innerHTML insertion.
 *
 * @example
 * ```ts
 * escapeHtml('<script>alert("xss")</script>');
 * // "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
 * ```
 */
export function escapeHtml(str: string): string {
  if (!str) return '';
  return str.replace(HTML_SPECIAL_CHARS_REGEX, (char) => HTML_ESCAPE_MAP[char] ?? char);
}

// ---------------------------------------------------------------------------
// Code Reference Formatting
// ---------------------------------------------------------------------------

/**
 * Formats a code reference by wrapping it with a specified delimiter.
 *
 * @param code - The code value.
 * @param delimiter - The wrapping character(s) (default: `'`).
 * @returns The formatted code reference.
 *
 * @example
 * ```ts
 * formatCodeRef('ERROR_001'); // "'ERROR_001'"
 * formatCodeRef('INFO', '['); // "[INFO]"
 * ```
 */
export function formatCodeRef(code: string, delimiter: string = "'"): string {
  if (!code) return '';
  return `${delimiter}${code}${delimiter}`;
}

/**
 * Strips all whitespace from a string.
 *
 * @param str - The input string.
 * @returns The string with all whitespace removed.
 *
 * @example
 * ```ts
 * stripWhitespace('  hello  world  '); // "helloworld"
 * ```
 */
export function stripWhitespace(str: string): string {
  if (!str) return '';
  return str.replace(/\s+/g, '');
}

/**
 * Normalizes whitespace by trimming and collapsing multiple spaces into one.
 *
 * @param str - The input string.
 * @returns The normalized string.
 *
 * @example
 * ```ts
 * normalizeWhitespace('  hello   world  '); // "hello world"
 * ```
 */
export function normalizeWhitespace(str: string): string {
  if (!str) return '';
  return str.trim().replace(/\s+/g, ' ');
}

/**
 * Pads a number with leading zeros.
 *
 * @param num - The number to format.
 * @param length - The total desired length (default: 2).
 * @returns Zero-padded string.
 *
 * @example
 * ```ts
 * padZero(5); // "05"
 * padZero(123, 5); // "00123"
 * ```
 */
export function padZero(num: number, length: number = 2): string {
  return String(num).padStart(length, '0');
}
