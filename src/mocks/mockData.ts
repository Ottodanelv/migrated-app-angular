/**
 * Mock payloads for the financial token management flow.
 *
 * Inspired by legacy OperacionFinancieraBO + OperacionFinancieraBean
 * from GestionTokenBusiness.obtenerInfoSmsFinanciero().
 *
 * @see AGENTS.md — codebase-memory-mcp search for GestionTokenBusiness
 */

import type { SmsOtpRequest } from '../app/core/services/sms.service';

/** Raw shape returned by the real backend's `ConsentimientoDto` (inside `POST /consentimientos`'s envelope). */
export interface ConsentimientoApiMock {
  idConsentimiento: string;
  tipoConsentimiento: string;
  ambito: string;
  version: string;
  textoLegal: string;
  textoInfo: string;
  fchNotaria: string;
}

/**
 * Raw shape returned by the real backend's `TokenFinancieroResponse`
 * (`GET /token/financiero/{token}`). Mirrors what MSW must return so
 * mocks and the real backend behave the same from the front's point of
 * view — mapping into `OperacionFinanciera` (deriving `valido`) happens
 * in `GestionTokenService`, not here.
 */
export interface TokenFinancieroApiMock {
  token: string;
  sociedad: string;
  nif: string;
  telefono: string;
  meses: number;
  mensualidad: number;
  comision: number;
  importe: number;
  impTotalAdeudado: number;
  tin: number;
  tae: number;
  fchProximoRecibo: string;
  tipoToken: string;
  fchAlta: string;
  fchCaducidad: string;
  numUsos: number;
}

/** Raw shape returned by the real backend's `TokenGenericoResponse` (`GET /token/generico/{token}`). */
export interface TokenGenericoApiMock {
  token: string;
  sociedad: string;
  nif: string;
  telefono: string;
  numUsos: number;
  fchInicio: string;
  fchFin: string;
  clienteFk: string;
  aplicacionFk: string;
  codigoNotifFk: string;
  cadenaFk: string;
  impDispMin: number;
  tipoToken: string;
  tipoAutenticacionFk: string;
}

/** Realistic mock for a valid financial token (COMPRA_PLAZO_TARJ-like, not compra plazos). */
export const MOCK_VALID_TOKEN: TokenFinancieroApiMock = {
  token: 'FIN-TOKEN-001',
  sociedad: '400',
  nif: '12345678A',
  telefono: '600123123',
  meses: 36,
  mensualidad: 347.22,
  comision: 150.0,
  importe: 12500.0,
  impTotalAdeudado: 12000.0,
  tin: 4.75,
  tae: 5.12,
  fchProximoRecibo: '2026-08-15',
  tipoToken: 'COMBOCARD',
  fchAlta: '2026-01-01T00:00:00Z',
  fchCaducidad: '2099-01-01T00:00:00Z',
  numUsos: 0,
};

/** Mock for an expired/invalid token response — `fchCaducidad` is in the past. */
export const MOCK_EXPIRED_TOKEN: TokenFinancieroApiMock = {
  ...MOCK_VALID_TOKEN,
  token: 'FIN-TOKEN-EXPIRED',
  fchCaducidad: '2000-01-01T00:00:00Z',
};

/** Additional mock for a default-type financial operation. */
export const MOCK_VALID_TOKEN_DEFAULT: TokenFinancieroApiMock = {
  ...MOCK_VALID_TOKEN,
  token: 'FIN-TOKEN-DEFAULT',
  importe: 5000.0,
  mensualidad: 208.33,
  meses: 24,
  impTotalAdeudado: 4800.0,
  comision: 75.0,
  fchProximoRecibo: '2026-09-01',
  tin: 3.99,
  tae: 4.25,
};

/** Dedicated mock for the COMBOCARD pre-authorization route flow. */
export const MOCK_PREAUT_TOKEN: TokenFinancieroApiMock = {
  ...MOCK_VALID_TOKEN,
  token: 'FIN-TOKEN-PREAUT',
  tipoToken: 'COMBOCARD',
};

/** Dedicated mock for the installment-purchase route flow. */
export const MOCK_COMPRA_PLAZOS_TOKEN: TokenFinancieroApiMock = {
  ...MOCK_VALID_TOKEN,
  token: 'FIN-TOKEN-COMPRA',
  tipoToken: 'COMPRA_PLAZO_TARJ',
};

/** Maps mock tokens to their responses for quick lookup. */
export const MOCK_TOKENS: Record<string, TokenFinancieroApiMock> = {
  [MOCK_VALID_TOKEN.token]: MOCK_VALID_TOKEN,
  [MOCK_EXPIRED_TOKEN.token]: MOCK_EXPIRED_TOKEN,
  [MOCK_VALID_TOKEN_DEFAULT.token]: MOCK_VALID_TOKEN_DEFAULT,
  [MOCK_PREAUT_TOKEN.token]: MOCK_PREAUT_TOKEN,
  [MOCK_COMPRA_PLAZOS_TOKEN.token]: MOCK_COMPRA_PLAZOS_TOKEN,
};

/** Mock for the cotitular generic token flow. */
export const MOCK_GENERIC_OPERATION: TokenGenericoApiMock = {
  token: 'GEN-TOKEN-001',
  sociedad: '800',
  nif: '12345678A',
  telefono: '600123123',
  numUsos: 0,
  fchInicio: '2026-01-01T00:00:00Z',
  fchFin: '2099-01-01T00:00:00Z',
  clienteFk: 'CLI01',
  aplicacionFk: 'APP01',
  codigoNotifFk: 'ALERT_CDAT_COT',
  cadenaFk: 'CAD01',
  impDispMin: 0,
  tipoToken: 'ALERT_CDAT_COT',
  tipoAutenticacionFk: 'SMS',
};

/** Mock for an invalid generic token response — `fchFin` is in the past. */
export const MOCK_GENERIC_OPERATION_INVALID: TokenGenericoApiMock = {
  ...MOCK_GENERIC_OPERATION,
  token: 'GEN-TOKEN-INVALID',
  fchFin: '2000-01-01T00:00:00Z',
};

/** Maps generic flow tokens to their responses for quick lookup. */
export const MOCK_GENERIC_TOKENS: Record<string, TokenGenericoApiMock> = {
  [MOCK_GENERIC_OPERATION.token]: MOCK_GENERIC_OPERATION,
  [MOCK_GENERIC_OPERATION_INVALID.token]: MOCK_GENERIC_OPERATION_INVALID,
};

/** Consent data used by the generic and consent management flows. */
export const MOCK_CONSENTIMIENTOS: ConsentimientoApiMock[] = [
  {
    idConsentimiento: 'CDAC-1',
    tipoConsentimiento: 'CDAC',
    ambito: 'COTITULAR',
    version: '1',
    textoLegal: 'Texto legal principal del consentimiento CDAC.',
    textoInfo: 'Texto ampliado del consentimiento CDAC.',
    fchNotaria: '2026-07-09',
  },
  {
    idConsentimiento: 'INTERCONEXION-1',
    tipoConsentimiento: 'INTERCONEXION',
    ambito: 'GENERAL',
    version: '1',
    textoLegal: 'Texto legal de interconexión.',
    textoInfo: '',
    fchNotaria: '2026-07-10',
  },
];

/** Successful OTP submission payload used by the cotitular flow. */
export const MOCK_SMS_RESPONSE: { enviado: boolean } = {
  enviado: true,
};

/** Valid OTP request body paired with the generic token flow. */
export const MOCK_SMS_REQUEST: SmsOtpRequest = {
  nif: MOCK_GENERIC_OPERATION.nif,
  sociedad: MOCK_GENERIC_OPERATION.sociedad,
  telefono: MOCK_GENERIC_OPERATION.telefono,
  aplicacionFk: MOCK_GENERIC_OPERATION.aplicacionFk,
  codigoNotifFk: MOCK_GENERIC_OPERATION.codigoNotifFk,
  cadenaFk: MOCK_GENERIC_OPERATION.cadenaFk,
  tipoToken: MOCK_GENERIC_OPERATION.tipoToken,
  tipoAutenticacionFk: MOCK_GENERIC_OPERATION.tipoAutenticacionFk,
};
