/**
 * Mock payloads for the financial token management flow.
 *
 * Inspired by legacy OperacionFinancieraBO + OperacionFinancieraBean
 * from GestionTokenBusiness.obtenerInfoSmsFinanciero().
 *
 * @see AGENTS.md — codebase-memory-mcp search for GestionTokenBusiness
 */

import type { SmsOtpRequest } from '../app/core/services/sms.service';
import type { Consentimiento } from '../app/models/consentimiento';
import type { OperacionFinanciera } from '../app/models/operacion-financiera';
import type { OperacionGenerica } from '../app/models/operacion-generica';

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

/** Mock for the cotitular generic token flow. */
export const MOCK_GENERIC_OPERATION: OperacionGenerica = {
  token: 'GEN-TOKEN-001',
  nif: '12345678A',
  telefono: '600123123',
  aplicacionFk: 'APP01',
  codigoNotifFk: 'ALERT_CDAT_COT',
  cadenaFk: 'CAD01',
  tipoToken: 'ALERT_CDAT_COT',
  tipoAutenticacionFk: 'SMS',
  valido: true,
};

/** Mock for an invalid generic token response. */
export const MOCK_GENERIC_OPERATION_INVALID: OperacionGenerica = {
  ...MOCK_GENERIC_OPERATION,
  token: 'GEN-TOKEN-INVALID',
  valido: false,
};

/** Maps generic flow tokens to their responses for quick lookup. */
export const MOCK_GENERIC_TOKENS: Record<string, OperacionGenerica> = {
  [MOCK_GENERIC_OPERATION.token]: MOCK_GENERIC_OPERATION,
  [MOCK_GENERIC_OPERATION_INVALID.token]: MOCK_GENERIC_OPERATION_INVALID,
};

/** Consent data used by the generic and consent management flows. */
export const MOCK_CONSENTIMIENTOS: Consentimiento[] = [
  {
    tipoConsentimiento: 'CDAC',
    textoLegal: 'Texto legal principal del consentimiento CDAC.',
    textoInfo: 'Texto ampliado del consentimiento CDAC.',
    aceptado: true,
    swTextoInfo: true,
    fchNotaria: '2026-07-09T10:00:00Z',
    obligatorio: true,
    masInfo: true,
  },
  {
    tipoConsentimiento: 'INTERCONEXION',
    textoLegal: 'Texto legal de interconexión.',
    textoInfo: '',
    aceptado: false,
    swTextoInfo: false,
    fchNotaria: '2026-07-10T08:30:00Z',
    obligatorio: false,
    masInfo: false,
  },
];

/** Successful OTP submission payload used by the cotitular flow. */
export const MOCK_SMS_RESPONSE: { enviado: boolean } = {
  enviado: true,
};

/** Valid OTP request body paired with the generic token flow. */
export const MOCK_SMS_REQUEST: SmsOtpRequest = {
  nif: MOCK_GENERIC_OPERATION.nif,
  telefono: MOCK_GENERIC_OPERATION.telefono,
  sociedad: '800',
  token: MOCK_GENERIC_OPERATION.token,
  aplicacion: MOCK_GENERIC_OPERATION.aplicacionFk,
  tipoAutenticacion: MOCK_GENERIC_OPERATION.tipoAutenticacionFk,
  codigoNotif: MOCK_GENERIC_OPERATION.codigoNotifFk,
};
