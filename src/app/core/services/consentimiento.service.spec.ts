/**
 * ConsentimientoService Tests
 *
 * Tests for the ConsentimientoService which manages user consents.
 * Uses Vitest with Angular testing utilities.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ConsentimientoService } from './consentimiento.service';

describe('ConsentimientoService', () => {
  let service: ConsentimientoService;
  let httpMock: HttpTestingController;

  /** Raw envelope returned by the real backend's `ObtenerConsentimientosResponse`. */
  const mockApiResponse = {
    consentimientos: [
      {
        idConsentimiento: 'CDAC-1',
        tipoConsentimiento: 'CDAC',
        ambito: 'COTITULAR',
        version: '1',
        textoLegal: 'Legal text for CDAC',
        textoInfo: 'Info text for CDAC',
        fchNotaria: '2026-07-08',
      },
      {
        idConsentimiento: 'INTERCONEXION-1',
        tipoConsentimiento: 'INTERCONEXION',
        ambito: 'GENERAL',
        version: '1',
        textoLegal: 'Legal text for INTERCONEXION',
        textoInfo: '',
        fchNotaria: '2026-07-08',
      },
    ],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withFetch()),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(ConsentimientoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('obtenerConsentimientos', () => {
    it('should POST the requested consent types and society, and unwrap the response', () => {
      service.obtenerConsentimientos(['CDAC', 'INTERCONEXION'], '800').subscribe((consentimientos) => {
        expect(consentimientos.length).toBe(2);
        expect(consentimientos[0].tipoConsentimiento).toBe('CDAC');
        expect(consentimientos[0].textoLegal).toBe('Legal text for CDAC');
        expect(consentimientos[0].idConsentimiento).toBe('CDAC-1');
        // UI-only fields default safely since the backend doesn't send them.
        expect(consentimientos[0].aceptado).toBe(false);
        expect(consentimientos[0].masInfo).toBe(true);
        expect(consentimientos[1].masInfo).toBe(false);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ consentimientos: ['CDAC', 'INTERCONEXION'], sociedad: '800' });
      req.flush(mockApiResponse);
    });

    it('should handle an empty consentimientos list in the response', () => {
      service.obtenerConsentimientos(['CDAC'], '800').subscribe((consentimientos) => {
        expect(consentimientos).toEqual([]);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}`);
      req.flush({ consentimientos: [] });
    });

    it('should handle HTTP error gracefully', () => {
      service.obtenerConsentimientos(['CDAC'], '800').subscribe({
        next: () => {
          // Should not reach here
          expect(true).toBe(false);
        },
        error: (error) => {
          expect(error).toBeDefined();
        },
      });

      const req = httpMock.expectOne(`${service['apiUrl']}`);
      req.error(new ProgressEvent('error'));
    });
  });

  describe('loadConsentimientos', () => {
    it('should update signals on successful load', () => {
      expect(service.loading()).toBe(false);
      expect(service.consentimientos()).toEqual([]);
      expect(service.error()).toBeNull();

      service.loadConsentimientos(['CDAC'], '800');

      expect(service.loading()).toBe(true);

      const req = httpMock.expectOne(`${service['apiUrl']}`);
      req.flush(mockApiResponse);

      expect(service.loading()).toBe(false);
      expect(service.consentimientos().length).toBe(2);
      expect(service.error()).toBeNull();
    });

    it('should set error signal on HTTP failure', () => {
      service.loadConsentimientos(['CDAC'], '800');

      const req = httpMock.expectOne(`${service['apiUrl']}`);
      req.error(new ProgressEvent('error'));

      expect(service.loading()).toBe(false);
      expect(service.error()).toBe('Error loading consents');
      expect(service.consentimientos()).toEqual([]);
    });

    it('should set loading signal during request', () => {
      // Initial state
      expect(service.loading()).toBe(false);

      service.loadConsentimientos(['CDAC'], '800');

      // Loading should be true during request
      expect(service.loading()).toBe(true);

      const req = httpMock.expectOne(`${service['apiUrl']}`);
      req.flush(mockApiResponse);

      // Loading should be false after request completes
      expect(service.loading()).toBe(false);
    });
  });
});
