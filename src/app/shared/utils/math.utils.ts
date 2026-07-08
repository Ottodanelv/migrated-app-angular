/**
 * Financial mathematics utility functions.
 *
 * Pure TypeScript helpers for financial calculations: rounding, installment
 * calculations, and interest approximations.
 *
 * @module shared/utils/math.utils
 */

// ---------------------------------------------------------------------------
// Rounding
// ---------------------------------------------------------------------------

/**
 * Rounds a number to 2 decimal places (standard financial rounding).
 *
 * Uses "round half up" (Math.round) for financial precision.
 *
 * @param value - The number to round.
 * @returns The number rounded to 2 decimal places.
 *
 * @example
 * ```ts
 * roundToCents(123.456); // 123.46
 * roundToCents(100); // 100
 * roundToCents(0.001); // 0
 * ```
 */
export function roundToCents(value: number): number {
  // Use Number.EPSILON as a safeguard against floating-point precision issues.
  // Without this, roundToCents(1.005) returns 1.00 because 1.005 * 100 = 100.499...
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Rounds a number to a specified number of decimal places.
 *
 * @param value - The number to round.
 * @param decimals - Number of decimal places (default: 2).
 * @returns The rounded number.
 *
 * @example
 * ```ts
 * roundToDecimals(123.4567, 3); // 123.457
 * roundToDecimals(123.4567, 0); // 123
 * ```
 */
export function roundToDecimals(value: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Floors a number to 2 decimal places (rounds down).
 *
 * Useful for conservative financial estimates (e.g., interest calculations
 * that must not overstate amounts).
 *
 * @param value - The number to floor.
 * @returns The number floored to 2 decimal places.
 *
 * @example
 * ```ts
 * floorToCents(123.456); // 123.45
 * floorToCents(123.001); // 123
 * ```
 */
export function floorToCents(value: number): number {
  return Math.floor(value * 100) / 100;
}

/**
 * Ceils a number to 2 decimal places (rounds up).
 *
 * @param value - The number to ceil.
 * @returns The number ceiled to 2 decimal places.
 *
 * @example
 * ```ts
 * ceilToCents(123.451); // 123.46
 * ```
 */
export function ceilToCents(value: number): number {
  return Math.ceil(value * 100) / 100;
}

// ---------------------------------------------------------------------------
// Installment / Payment Calculation
// ---------------------------------------------------------------------------

/**
 * Calculates the monthly payment for a fixed-rate loan using the
 * standard amortization formula (French amortization system).
 *
 * Formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
 * Where:
 *   - M = monthly payment
 *   - P = principal (loan amount)
 *   - r = monthly interest rate (annual rate / 12)
 *   - n = number of monthly payments
 *
 * @param principal - The loan principal amount (positive).
 * @param months - Number of monthly payments (term in months).
 * @param annualInterestRate - Annual interest rate as a decimal (e.g., 0.05 for 5% APR).
 * @returns The monthly payment amount, rounded to cents.
 *
 * @throws {Error} If principal, months, or interest rate are invalid.
 *
 * @example
 * ```ts
 * // €10,000 loan at 5% APR for 24 months
 * calculateMonthlyPayment(10000, 24, 0.05);
 * // Returns approximately 438.71
 * ```
 */
export function calculateMonthlyPayment(
  principal: number,
  months: number,
  annualInterestRate: number,
): number {
  if (!Number.isFinite(principal) || principal <= 0) {
    throw new Error('Principal must be a positive finite number');
  }
  if (!Number.isInteger(months) || months < 1) {
    throw new Error('Months must be a positive integer');
  }
  if (!Number.isFinite(annualInterestRate) || annualInterestRate < 0) {
    throw new Error('Annual interest rate must be a non-negative finite number');
  }

  if (annualInterestRate === 0) {
    return roundToCents(principal / months);
  }

  const monthlyRate = annualInterestRate / 12;
  const compoundFactor = Math.pow(1 + monthlyRate, months);
  const payment = principal * (monthlyRate * compoundFactor) / (compoundFactor - 1);

  return roundToCents(payment);
}

/**
 * Calculates the total interest paid over the life of a fixed-rate loan.
 *
 * @param principal - The loan principal amount.
 * @param months - Number of monthly payments.
 * @param annualInterestRate - Annual interest rate as a decimal.
 * @returns Total interest amount, rounded to cents.
 *
 * @example
 * ```ts
 * calculateTotalInterest(10000, 24, 0.05);
 * // Returns approximately 529.04
 * ```
 */
export function calculateTotalInterest(
  principal: number,
  months: number,
  annualInterestRate: number,
): number {
  const monthlyPayment = calculateMonthlyPayment(principal, months, annualInterestRate);
  const totalPaid = monthlyPayment * months;
  return roundToCents(totalPaid - principal);
}

/**
 * Calculates the Annual Percentage Rate (APR / TAE) equivalent from a
 * nominal annual interest rate with monthly compounding.
 *
 * TAE = (1 + r)^12 - 1
 * Where r = nominal annual rate / 12
 *
 * @param nominalRate - Nominal annual interest rate as a decimal (e.g., 0.05 for 5%).
 * @returns The APR/TAE as a decimal, rounded to 4 decimal places.
 *
 * @example
 * ```ts
 * // 5% nominal APR with monthly compounding
 * calculateApr(0.05);
 * // Returns approximately 0.0512 (5.12% TAE)
 * ```
 */
export function calculateApr(nominalRate: number): number {
  if (!Number.isFinite(nominalRate) || nominalRate < 0) {
    throw new Error('Nominal rate must be a non-negative finite number');
  }

  const monthlyRate = nominalRate / 12;
  const tae = Math.pow(1 + monthlyRate, 12) - 1;
  return roundToDecimals(tae, 4);
}

// ---------------------------------------------------------------------------
// Percentage Calculations
// ---------------------------------------------------------------------------

/**
 * Calculates what percentage `part` is of `total`.
 *
 * @param part - The partial value.
 * @param total - The total value (must be > 0).
 * @returns The percentage as a decimal (e.g., 0.25 for 25%).
 *
 * @throws {Error} If total is zero or negative.
 *
 * @example
 * ```ts
 * calculatePercentage(25, 100); // 0.25
 * calculatePercentage(1, 3); // 0.3333...
 * ```
 */
export function calculatePercentage(part: number, total: number): number {
  if (!Number.isFinite(total) || total <= 0) {
    throw new Error('Total must be a positive finite number');
  }
  if (!Number.isFinite(part)) {
    throw new Error('Part must be a finite number');
  }

  return part / total;
}

/**
 * Applies a percentage to a base value.
 *
 * @param base - The base value.
 * @param percentage - The percentage as a decimal (e.g., 0.21 for 21%).
 * @returns The resulting value.
 *
 * @example
 * ```ts
 * applyPercentage(1000, 0.21); // 210
 * ```
 */
export function applyPercentage(base: number, percentage: number): number {
  if (!Number.isFinite(base)) {
    throw new Error('Base must be a finite number');
  }
  if (!Number.isFinite(percentage)) {
    throw new Error('Percentage must be a finite number');
  }

  return base * percentage;
}

/**
 * Adds a percentage to a base value (e.g., calculate gross from net + VAT).
 *
 * @param base - The base value.
 * @param percentage - The percentage as a decimal.
 * @returns The base plus the percentage amount.
 *
 * @example
 * ```ts
 * addPercentage(1000, 0.21); // 1210 (1000 + 21% VAT)
 * ```
 */
export function addPercentage(base: number, percentage: number): number {
  return base + applyPercentage(base, percentage);
}

/**
 * Calculates the sum of an array of numbers.
 *
 * @param values - Array of numeric values.
 * @returns The sum.
 *
 * @example
 * ```ts
 * sum([1, 2, 3, 4, 5]); // 15
 * sum([]); // 0
 * ```
 */
export function sum(values: readonly number[]): number {
  return values.reduce((acc, val) => acc + val, 0);
}

/**
 * Calculates the average (mean) of an array of numbers.
 *
 * @param values - Array of numeric values.
 * @returns The average, or 0 for an empty array.
 *
 * @example
 * ```ts
 * average([10, 20, 30]); // 20
 * average([]); // 0
 * ```
 */
export function average(values: readonly number[]): number {
  if (values.length === 0) return 0;
  return sum(values) / values.length;
}
