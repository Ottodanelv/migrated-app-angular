import { TokenType } from './token-type';

/**
 * Financial operation data returned by the token management API.
 *
 * Merges fields from legacy OperacionFinancieraBean (view layer)
 * and OperacionFinancieraBO (business layer).
 *
 * Used with Angular Signals:
 * ```typescript
 * readonly operacion = signal<OperacionFinanciera | null>(null);
 * ```
 */
export interface OperacionFinanciera {
  /** Unique token identifier for this operation */
  readonly token: string;

  /** Total loan amount (Java BigDecimal → number) */
  readonly importe: number;

  /** Monthly installment amount (Java BigDecimal → number) */
  readonly mensualidad: number;

  /** Number of monthly installments */
  readonly meses: number;

  /** Total outstanding/debt amount (Java BigDecimal → number) */
  readonly impTotalAdeudado: number;

  /** Commission amount (Java BigDecimal → number) */
  readonly comision: number;

  /** Next payment/receipt date (ISO 8601 string, e.g. "2026-08-15") */
  readonly fchProximoRecibo: string;

  /** Nominal Interest Rate — TIN (Java BigDecimal → number, e.g. 4.75) */
  readonly tin: number;

  /** Annual Equivalent Rate — TAE (Java BigDecimal → number, e.g. 5.12) */
  readonly tae: number;

  /** Whether the token is valid (not expired). From BO layer. */
  readonly valido: boolean;

  /** Token type classifier. From BO layer. Determines which view to render. */
  readonly tipoToken: TokenType;
}
