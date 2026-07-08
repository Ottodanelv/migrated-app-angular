/**
 * Consent record for legal/regulatory compliance.
 *
 * Represents a single consent item (e.g., data sharing, interconnection)
 * that the user must accept/decline. Migrated from ConsentimientoBO.
 *
 * Note: Legacy methods getSwConsentimientoString() and getSwTextoInfoString()
 * are REMOVED — they returned Java constant strings for server-side tracing.
 * In Angular, use computed signals or template logic if needed.
 */
export interface Consentimiento {
  /** Consent type identifier (e.g., 'CDAC', 'INTERCONEXION') */
  readonly tipoConsentimiento: string;

  /** Full legal text to display to the user */
  readonly textoLegal: string;

  /** Supplementary informational text (shown in "more info" expandable) */
  readonly textoInfo: string;

  /** Whether the user has accepted this consent */
  readonly aceptado: boolean;

  /** Whether the user has read the informational text */
  readonly swTextoInfo: boolean;

  /** Notary timestamp of consent (ISO 8601 string, e.g. "2026-07-08T12:00:00Z") */
  readonly fchNotaria: string;

  /** Whether this consent is mandatory (cannot be declined) */
  readonly obligatorio: boolean;

  /** Whether supplementary information is available for this consent */
  readonly masInfo: boolean;
}
