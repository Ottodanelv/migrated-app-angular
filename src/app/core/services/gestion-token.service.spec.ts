/**
 * Tests for GestionTokenService.
 *
 * Uses Angular's HttpClientTestingController to mock HTTP responses
 * without making real network requests.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { GestionTokenService } from './gestion-token.service';
import { environment } from '../../../environments/environment';
import type { OperacionFinanciera } from '../../models/operacion-financiera';
import type { OperacionGenerica } from '../../models/operacion-generica';

describe('GestionTokenService', () => {
  let service: GestionTokenService;
  let httpMock: HttpTestingController;

  const mockOperacion: OperacionFinanciera = {
    token: 'FIN-TOKEN-001',
    importe: 12500.0,
    mensualidad: 347.22,
    meses: 36,
    impTotalAdeudado: 12000.0,
    comision: 150.0,
    fchProximoRecibo: '2026-08-15',
    tin: 4.75,
    tae: 5.12,
    valido: true,
    tipoToken: 'COMBOCARD',
  };

  const apiUrl = `${environment.apiBaseUrl}/gestion-token/info-sms-financiero`;
  const genericApiUrl = `${environment.apiBaseUrl}/gestion-token/info-sms-generico`;
  const mockOperacionGenerica: OperacionGenerica = {
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GestionTokenService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(GestionTokenService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('obtenerInfoSmsFinanciero', () => {
    it('should return financial operation data for a valid token', async () => {
      // Act
      const result$ = service.obtenerInfoSmsFinanciero('FIN-TOKEN-001');
      const resultPromise = new Promise<OperacionFinanciera>((resolve) => {
        result$.subscribe((data) => resolve(data));
      });

      // Assert — the HTTP request was made
      const req = httpMock.expectOne(
        (r) =>
          r.url === apiUrl && r.params.get('token') === 'FIN-TOKEN-001',
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockOperacion);

      const result = await resultPromise;
      expect(result.token).toBe('FIN-TOKEN-001');
      expect(result.importe).toBe(12500.0);
      expect(result.valido).toBe(true);
      expect(result.tipoToken).toBe('COMBOCARD');
    });

    it('should include the token as a query parameter', () => {
      // Act
      service.obtenerInfoSmsFinanciero('TEST-TOKEN').subscribe();

      // Assert
      const req = httpMock.expectOne(
        (r) =>
          r.url === apiUrl && r.params.get('token') === 'TEST-TOKEN',
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockOperacion);
    });

    it('should propagate HTTP errors to the caller', async () => {
      // Act
      const result$ = service.obtenerInfoSmsFinanciero('INVALID-TOKEN');
      const errorPromise = new Promise<string>((resolve) => {
        result$.subscribe({
          error: (err) => resolve(err.statusText),
        });
      });

      // Assert
      const req = httpMock.expectOne(
        (r) =>
          r.url === apiUrl &&
          r.params.get('token') === 'INVALID-TOKEN',
      );
      req.flush('Not found', {
        status: 404,
        statusText: 'Not Found',
      });

      const error = await errorPromise;
      expect(error).toBe('Not Found');
    });
  });

  describe('utilizarInfoSmsGenerico', () => {
    it('should return generic operation data for a valid token', async () => {
      const result$ = service.utilizarInfoSmsGenerico('GEN-TOKEN-001');
      const resultPromise = new Promise<OperacionGenerica>((resolve) => {
        result$.subscribe((data) => resolve(data));
      });

      const req = httpMock.expectOne(
        (r) =>
          r.url === genericApiUrl && r.params.get('token') === 'GEN-TOKEN-001',
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockOperacionGenerica);

      const result = await resultPromise;
      expect(result.tipoToken).toBe('ALERT_CDAT_COT');
      expect(result.telefono).toBe('600123123');
    });
  });
});
