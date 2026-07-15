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

  /** Raw shape returned by the real backend's `TokenFinancieroResponse`. */
  const apiFinancieroResponse = {
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

  /** Raw shape returned by the real backend's `TokenGenericoResponse`. */
  const apiGenericoResponse = {
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

  const apiUrl = `${environment.apiBaseUrl}/token/financiero/FIN-TOKEN-001`;
  const genericApiUrl = `${environment.apiBaseUrl}/token/generico/GEN-TOKEN-001`;

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
    it('should call the real backend read endpoint with the token as a path variable', () => {
      service.obtenerInfoSmsFinanciero('FIN-TOKEN-001').subscribe();

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(apiFinancieroResponse);
    });

    it('should map the backend response into OperacionFinanciera, deriving valido from fchCaducidad', async () => {
      const result$ = service.obtenerInfoSmsFinanciero('FIN-TOKEN-001');
      const resultPromise = new Promise<OperacionFinanciera>((resolve) => {
        result$.subscribe((data) => resolve(data));
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(apiFinancieroResponse);

      const result = await resultPromise;
      expect(result.token).toBe('FIN-TOKEN-001');
      expect(result.importe).toBe(12500.0);
      expect(result.valido).toBe(true);
      expect(result.tipoToken).toBe('COMBOCARD');
      expect(result.fchCaducidad).toBe('2099-01-01T00:00:00Z');
      expect(result.numUsos).toBe(0);
    });

    it('should derive valido as false when fchCaducidad is in the past', async () => {
      const expiredResponse = {
        ...apiFinancieroResponse,
        fchCaducidad: '2000-01-01T00:00:00Z',
      };

      const result$ = service.obtenerInfoSmsFinanciero('FIN-TOKEN-001');
      const resultPromise = new Promise<OperacionFinanciera>((resolve) => {
        result$.subscribe((data) => resolve(data));
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(expiredResponse);

      const result = await resultPromise;
      expect(result.valido).toBe(false);
    });

    it('should propagate HTTP errors to the caller', async () => {
      const result$ = service.obtenerInfoSmsFinanciero('FIN-TOKEN-001');
      const errorPromise = new Promise<string>((resolve) => {
        result$.subscribe({
          error: (err) => resolve(err.statusText),
        });
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush('Not found', {
        status: 404,
        statusText: 'Not Found',
      });

      const error = await errorPromise;
      expect(error).toBe('Not Found');
    });
  });

  describe('utilizarInfoSmsGenerico', () => {
    it('should call the real backend read endpoint with the token as a path variable', () => {
      service.utilizarInfoSmsGenerico('GEN-TOKEN-001').subscribe();

      const req = httpMock.expectOne(genericApiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(apiGenericoResponse);
    });

    it('should map the backend response into OperacionGenerica, deriving valido from fchFin', async () => {
      const result$ = service.utilizarInfoSmsGenerico('GEN-TOKEN-001');
      const resultPromise = new Promise<OperacionGenerica>((resolve) => {
        result$.subscribe((data) => resolve(data));
      });

      const req = httpMock.expectOne(genericApiUrl);
      req.flush(apiGenericoResponse);

      const result = await resultPromise;
      expect(result.tipoToken).toBe('ALERT_CDAT_COT');
      expect(result.telefono).toBe('600123123');
      expect(result.valido).toBe(true);
      expect(result.fchFin).toBe('2099-01-01T00:00:00Z');
    });
  });
});
