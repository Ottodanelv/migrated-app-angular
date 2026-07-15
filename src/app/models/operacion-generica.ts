import { TokenType } from './token-type';

/**
 * Generic operation data returned by the token management API.
 *
 * Used for non-financial token operations (e.g., cotitular consent,
 * generic notifications). Merges fields from OperacionGenericaBean
 * and OperacionGenericaBO.
 */
export interface OperacionGenerica {
  /** Unique token identifier for this operation */
  readonly token: string;

  /** Tax identification number (DNI/NIE) */
  readonly nif: string;

  /** Contact phone number */
  readonly telefono: string;

  /** Foreign key to the source application */
  readonly aplicacionFk: string;

  /** Foreign key to the notification code */
  readonly codigoNotifFk: string;

  /** Foreign key to the business chain/cadena */
  readonly cadenaFk: string;

  /** Token type classifier. Determines routing behavior. */
  readonly tipoToken: TokenType;

  /** Foreign key to the authentication type */
  readonly tipoAutenticacionFk: string;

  /**
   * Whether the token is valid (not expired).
   * Derived in the front from `fchFin` — the real backend
   * (`TokenGenericoResponse`) does not send this boolean.
   */
  readonly valido: boolean;

  /** Token creation timestamp (ISO 8601). From `TokenGenericoResponse.fchInicio`. */
  readonly fchInicio?: string;

  /** Token expiry timestamp (ISO 8601) — source of truth for `valido`. */
  readonly fchFin?: string;

  /** Number of times the token has been used. From `TokenGenericoResponse.numUsos`. */
  readonly numUsos?: number;
}
