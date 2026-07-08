/**
 * Shared Utilities barrel file.
 *
 * Re-exports all utility functions from the utils module for convenient imports.
 *
 * Usage:
 * ```ts
 * import { formatCurrency, isValidNif, debounce } from '../../shared/utils';
 * ```
 *
 * @module shared/utils
 */

export {
  formatCurrency,
  formatPercentage,
  formatNumber,
  formatDate,
  formatRelativeTime,
  DATE_FORMATS,
  DEFAULT_LOCALE,
  DEFAULT_CURRENCY,
} from './format.utils';

export {
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

export {
  capitalize,
  capitalizeWords,
  truncate,
  escapeHtml,
  formatCodeRef,
  stripWhitespace,
  normalizeWhitespace,
  padZero,
} from './string.utils';

export {
  debounce,
  deepClone,
  isEqual,
  groupBy,
  partition,
  unique,
  omit,
  pick,
} from './general.utils';

export {
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
