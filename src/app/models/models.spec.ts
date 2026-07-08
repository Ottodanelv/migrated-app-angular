import { describe, it, expect } from 'vitest';
import { OperacionFinanciera } from './operacion-financiera';
import { OperacionGenerica } from './operacion-generica';
import { Consentimiento } from './consentimiento';
import { TokenType } from './token-type';

describe('Domain Models', () => {
  describe('OperacionFinanciera', () => {
    it('should accept a valid mock object', () => {
      const mock: OperacionFinanciera = {
        token: 'abc123',
        importe: 10000.50,
        mensualidad: 250.75,
        meses: 48,
        impTotalAdeudado: 9500.00,
        comision: 150.00,
        fchProximoRecibo: '2026-08-15',
        tin: 4.75,
        tae: 5.12,
        valido: true,
        tipoToken: 'COMPRA_PLAZO_TARJ',
      };
      expect(mock.token).toBe('abc123');
      expect(mock.valido).toBe(true);
    });

    it('should accept unknown token types (string fallback)', () => {
      const mock: OperacionFinanciera = {
        token: 'xyz',
        importe: 0,
        mensualidad: 0,
        meses: 0,
        impTotalAdeudado: 0,
        comision: 0,
        fchProximoRecibo: '',
        tin: 0,
        tae: 0,
        valido: false,
        tipoToken: 'UNKNOWN_FUTURE_TYPE',
      };
      expect(mock.tipoToken).toBe('UNKNOWN_FUTURE_TYPE');
    });
  });

  describe('OperacionGenerica', () => {
    it('should accept a valid mock object', () => {
      const mock: OperacionGenerica = {
        token: 'gen-token',
        nif: '12345678A',
        telefono: '+34600123456',
        aplicacionFk: 'APP001',
        codigoNotifFk: 'NOTIF001',
        cadenaFk: 'CAD001',
        tipoToken: 'ALERT_CDAT_COT',
        tipoAutenticacionFk: 'OTP',
        valido: true,
      };
      expect(mock.nif).toBe('12345678A');
    });
  });

  describe('Consentimiento', () => {
    it('should accept a valid mock object', () => {
      const mock: Consentimiento = {
        tipoConsentimiento: 'CDAC',
        textoLegal: 'Legal text here',
        textoInfo: 'Info text here',
        aceptado: false,
        swTextoInfo: true,
        fchNotaria: '2026-07-08T12:00:00Z',
        obligatorio: true,
        masInfo: false,
      };
      expect(mock.obligatorio).toBe(true);
      expect(mock.aceptado).toBe(false);
    });
  });

  describe('TokenType', () => {
    it('should accept known values', () => {
      const t1: TokenType = 'COMPRA_PLAZO_TARJ';
      const t2: TokenType = 'COMBOCARD';
      const t3: TokenType = 'ALERT_CDAT_COT';
      expect(t1).toBe('COMPRA_PLAZO_TARJ');
      expect(t2).toBe('COMBOCARD');
      expect(t3).toBe('ALERT_CDAT_COT');
    });

    it('should accept unknown string values (fallback)', () => {
      const t: TokenType = 'NEW_TYPE_NOT_YET_KNOWN';
      expect(t).toBe('NEW_TYPE_NOT_YET_KNOWN');
    });
  });
});
