/**
 * Token type identifier from the notification system.
 *
 * Known values (from legacy NotificacionEnum):
 * - `'COMPRA_PLAZO_TARJ'` — Compra a plazos con tarjeta (routes to compra-plazos view)
 * - `'COMBOCARD'` — Combo card pre-authorization (routes to preaut view)
 * - `'ALERT_CDAT_COT'` — Alerta cotitular CDAT (routes to generica view)
 *
 * The `(string & {})` fallback allows unknown future token types
 * while preserving autocomplete for known values.
 */
export type TokenType =
  | 'COMPRA_PLAZO_TARJ'
  | 'COMBOCARD'
  | 'ALERT_CDAT_COT'
  | (string & {});
