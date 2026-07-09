/**
 * Mock payloads for the financial token management flow.
 *
 * Inspired by legacy OperacionFinancieraBO + OperacionFinancieraBean
 * from GestionTokenBusiness.obtenerInfoSmsFinanciero().
 *
 * @see AGENTS.md — codebase-memory-mcp search for GestionTokenBusiness
 */

import type { OperacionFinanciera } from '../app/models/operacion-financiera';

/** Realistic mock for a valid financial SMS token (COMPRA_PLAZO_TARJ-like, not compra plazos). */
export const MOCK_VALID_TOKEN: OperacionFinanciera = {
  token: 'FIN-TOKEN-001',
  importe: 12500.00,
  mensualidad: 347.22,
  meses: 36,
  impTotalAdeudado: 12000.00,
  comision: 150.00,
  fchProximoRecibo: '2026-08-15',
  tin: 4.75,
  tae: 5.12,
  valido: true,
  tipoToken: 'COMBOCARD',
};

/** Mock for an expired/invalid token response. */
export const MOCK_EXPIRED_TOKEN: OperacionFinanciera = {
  token: 'FIN-TOKEN-EXPIRED',
  importe: 0,
  mensualidad: 0,
  meses: 0,
  impTotalAdeudado: 0,
  comision: 0,
  fchProximoRecibo: '',
  tin: 0,
  tae: 0,
  valido: false,
  tipoToken: 'COMBOCARD',
};

/** Additional mock for a default-type financial operation. */
export const MOCK_VALID_TOKEN_DEFAULT: OperacionFinanciera = {
  token: 'FIN-TOKEN-DEFAULT',
  importe: 5000.00,
  mensualidad: 208.33,
  meses: 24,
  impTotalAdeudado: 4800.00,
  comision: 75.00,
  fchProximoRecibo: '2026-09-01',
  tin: 3.99,
  tae: 4.25,
  valido: true,
  tipoToken: 'COMBOCARD',
};

/** Maps mock tokens to their responses for quick lookup. */
export const MOCK_TOKENS: Record<string, OperacionFinanciera> = {
  [MOCK_VALID_TOKEN.token]: MOCK_VALID_TOKEN,
  [MOCK_EXPIRED_TOKEN.token]: MOCK_EXPIRED_TOKEN,
  [MOCK_VALID_TOKEN_DEFAULT.token]: MOCK_VALID_TOKEN_DEFAULT,
};
