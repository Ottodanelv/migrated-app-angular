/**
 * Formatting utility functions migrated from legacy gestionWeb JS utilities.
 *
 * Provides pure TypeScript formatting helpers for currency, percentage, dates,
 * and numbers. These complement Angular pipes (CurrencyPipe, DecimalPipe, DatePipe)
 * for use in TypeScript code outside templates.
 *
 * @source Legacy:
 *   - {@link .../gestionWeb/src/main/webapp/resources/js/generico/util.js}
 *   - {@link .../gestionWeb/src/main/webapp/resources/js/cmcredit-common.js}
 *
 * @module shared/utils/format.utils
 */

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

/** Default locale for formatting operations (Spanish). */
export const DEFAULT_LOCALE = 'es-ES';

/** Default currency for financial operations (Euro). */
export const DEFAULT_CURRENCY = 'EUR';

// ---------------------------------------------------------------------------
// Number Formatting
// ---------------------------------------------------------------------------

/**
 * Formats a number as currency (EUR by default).
 *
 * @param value - The numeric value to format.
 * @param currency - ISO 4217 currency code (default: EUR).
 * @param locale - BCP 47 locale tag (default: es-ES).
 * @returns Formatted currency string (e.g., "1.234,56 €").
 *
 * @example
 * ```ts
 * formatCurrency(1234.56); // "1.234,56 €"
 * formatCurrency(1000, 'USD', 'en-US'); // "$1,000.00"
 * ```
 *
 * Angular equivalent: `CurrencyPipe` — use `{{ value | currency:'EUR':'symbol':'1.2-2' }}` in templates.
 */
export function formatCurrency(
  value: number,
  currency: string = DEFAULT_CURRENCY,
  locale: string = DEFAULT_LOCALE,
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formats a number as a percentage.
 *
 * @param value - The decimal value (e.g., 0.25 for 25%).
 * @param decimals - Number of decimal places (default: 2).
 * @param locale - BCP 47 locale tag (default: es-ES).
 * @returns Formatted percentage string (e.g., "25,00 %").
 *
 * @example
 * ```ts
 * formatPercentage(0.25); // "25,00 %"
 * formatPercentage(0.33333, 1); // "33,3 %"
 * ```
 *
 * Angular equivalent: `PercentPipe` — use `{{ value | percent:'1.2-2' }}` in templates.
 */
export function formatPercentage(
  value: number,
  decimals: number = 2,
  locale: string = DEFAULT_LOCALE,
): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Formats a number with grouped thousands and configurable decimals.
 *
 * @param value - The numeric value to format.
 * @param minDecimals - Minimum decimal places (default: 0).
 * @param maxDecimals - Maximum decimal places (default: 2).
 * @param locale - BCP 47 locale tag (default: es-ES).
 * @returns Formatted number string (e.g., "1.234,56").
 *
 * @example
 * ```ts
 * formatNumber(1234.5678); // "1.234,57"
 * formatNumber(1000, 2, 2); // "1.000,00"
 * ```
 *
 * Angular equivalent: `DecimalPipe` — use `{{ value | number:'1.0-2' }}` in templates.
 */
export function formatNumber(
  value: number,
  minDecimals: number = 0,
  maxDecimals: number = 2,
  locale: string = DEFAULT_LOCALE,
): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: minDecimals,
    maximumFractionDigits: maxDecimals,
  }).format(value);
}

// ---------------------------------------------------------------------------
// Date Formatting
// ---------------------------------------------------------------------------

/**
 * Standard date format patterns for use with formatDate().
 */
export const DATE_FORMATS = {
  /** DD/MM/YYYY (default) */
  SHORT: 'dd/MM/yyyy',
  /** DD/MM/YYYY HH:mm */
  SHORT_WITH_TIME: 'dd/MM/yyyy HH:mm',
  /** Full date: "1 de enero de 2024" */
  LONG: 'd \'de\' MMMM \'de\' yyyy',
  /** Day and month only: "1 de enero" */
  DAY_MONTH: 'd \'de\' MMMM',
  /** Month and year only: "enero de 2024" */
  MONTH_YEAR: 'MMMM \'de\' yyyy',
  /** Time only: HH:mm */
  TIME: 'HH:mm',
} as const;

/**
 * Formats a Date or date string using Intl.DateTimeFormat with flexible patterns.
 *
 * Supports common pattern tokens via presets, or custom dateStyle/timeStyle options.
 *
 * @param date - Date object, ISO string, or timestamp.
 * @param format - Format preset key from DATE_FORMATS, or custom Intl.DateTimeFormatOptions.
 * @param locale - BCP 47 locale tag (default: es-ES).
 * @returns Formatted date string.
 *
 * @example
 * ```ts
 * formatDate(new Date(2024, 0, 1)); // "01/01/2024"
 * formatDate('2024-01-01', DATE_FORMATS.LONG); // "1 de enero de 2024"
 * ```
 *
 * Angular equivalent: `DatePipe` — use `{{ dateValue | date:'dd/MM/yyyy' }}` in templates.
 */
export function formatDate(
  date: Date | string | number,
  format: keyof typeof DATE_FORMATS = 'SHORT',
  locale: string = DEFAULT_LOCALE,
): string {
  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) {
    return '';
  }

  const formatPattern = DATE_FORMATS[format];

  // Map our format patterns to Intl.DateTimeFormatOptions
  const formatOptionsMap: Record<keyof typeof DATE_FORMATS, Intl.DateTimeFormatOptions> = {
    SHORT: { day: '2-digit', month: '2-digit', year: 'numeric' },
    SHORT_WITH_TIME: {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
    LONG: { day: 'numeric', month: 'long', year: 'numeric' },
    DAY_MONTH: { day: 'numeric', month: 'long' },
    MONTH_YEAR: { month: 'long', year: 'numeric' },
    TIME: { hour: '2-digit', minute: '2-digit' },
  };

  const options = formatOptionsMap[format];
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

/**
 * Formats a date as a relative time string ("hace 3 días", "dentro de 2 horas").
 *
 * @param date - The date to compare against now.
 * @param locale - BCP 47 locale tag (default: es-ES).
 * @returns Relative time string.
 *
 * @example
 * ```ts
 * formatRelativeTime(new Date(Date.now() - 86400000)); // "hace 1 día"
 * ```
 */
export function formatRelativeTime(
  date: Date | string | number,
  locale: string = DEFAULT_LOCALE,
): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  const now = Date.now();
  const diffMs = dateObj.getTime() - now;
  const diffSeconds = Math.round(diffMs / 1000);
  const absDiffSeconds = Math.abs(diffSeconds);

  // Use Intl.RelativeTimeFormat when available
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const RelativeTimeFormat = (Intl as any).RelativeTimeFormat as
    | (new (loc: string, opts?: Record<string, string>) => { format(value: number, unit: string): string })
    | undefined;
  /* eslint-enable @typescript-eslint/no-explicit-any */

  if (typeof RelativeTimeFormat === 'function') {
    const rtf = new RelativeTimeFormat(locale, { numeric: 'always' });

    if (absDiffSeconds < 60) return rtf.format(diffSeconds, 'second');
    const diffMinutes = Math.round(diffSeconds / 60);
    if (Math.abs(diffMinutes) < 60) return rtf.format(diffMinutes, 'minute');
    const diffHours = Math.round(diffMinutes / 60);
    if (Math.abs(diffHours) < 24) return rtf.format(diffHours, 'hour');
    const diffDays = Math.round(diffHours / 24);
    if (Math.abs(diffDays) < 30) return rtf.format(diffDays, 'day');
    const diffMonths = Math.round(diffDays / 30);
    if (Math.abs(diffMonths) < 12) return rtf.format(diffMonths, 'month');
    const diffYears = Math.round(diffMonths / 12);
    return rtf.format(diffYears, 'year');
  }

  // Fallback: basic relative formatting
  if (absDiffSeconds < 60) return diffSeconds >= 0 ? 'ahora' : 'ahora';
  if (absDiffSeconds < 3600) {
    const m = Math.floor(absDiffSeconds / 60);
    return diffSeconds >= 0 ? `en ${m} min` : `hace ${m} min`;
  }
  if (absDiffSeconds < 86400) {
    const h = Math.floor(absDiffSeconds / 3600);
    return diffSeconds >= 0 ? `en ${h} h` : `hace ${h} h`;
  }
  const d = Math.floor(absDiffSeconds / 86400);
  return diffSeconds >= 0 ? `en ${d} días` : `hace ${d} días`;
}
