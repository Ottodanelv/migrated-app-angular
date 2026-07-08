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

  /** Whether the token is valid (not expired). From BO layer. */
  readonly valido: boolean;
}
