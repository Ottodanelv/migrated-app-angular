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
import { Consentimiento } from '../../models/consentimiento';

describe('ConsentimientoService', () => {
  let service: ConsentimientoService;
  let httpMock: HttpTestingController;

  const mockConsentimientos: Consentimiento[] = [
    {
      tipoConsentimiento: 'CDAC',
      textoLegal: 'Legal text for CDAC',
      textoInfo: 'Info text for CDAC',
      aceptado: true,
      swTextoInfo: true,
      fchNotaria: '2026-07-08T12:00:00Z',
      obligatorio: true,
      masInfo: false,
    },
    {
      tipoConsentimiento: 'INTERCONEXION',
      textoLegal: 'Legal text for INTERCONEXION',
      textoInfo: 'Info text for INTERCONEXION',
      aceptado: false,
      swTextoInfo: false,
      fchNotaria: '2026-07-08T12:00:00Z',
      obligatorio: false,
      masInfo: true,
    },
  ];

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
    it('should return consents from API', () => {
      service.obtenerConsentimientos().subscribe((consentimientos) => {
        expect(consentimientos).toEqual(mockConsentimientos);
        expect(consentimientos.length).toBe(2);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockConsentimientos);
    });

    it('should handle empty response', () => {
      service.obtenerConsentimientos().subscribe((consentimientos) => {
        expect(consentimientos).toEqual([]);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}`);
      req.flush([]);
    });

    it('should handle HTTP error gracefully', () => {
      service.obtenerConsentimientos().subscribe({
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

      service.loadConsentimientos();

      expect(service.loading()).toBe(true);

      const req = httpMock.expectOne(`${service['apiUrl']}`);
      req.flush(mockConsentimientos);

      expect(service.loading()).toBe(false);
      expect(service.consentimientos()).toEqual(mockConsentimientos);
      expect(service.error()).toBeNull();
    });

    it('should set error signal on HTTP failure', () => {
      service.loadConsentimientos();

      const req = httpMock.expectOne(`${service['apiUrl']}`);
      req.error(new ProgressEvent('error'));

      expect(service.loading()).toBe(false);
      expect(service.error()).toBe('Error loading consents');
      expect(service.consentimientos()).toEqual([]);
    });

    it('should set loading signal during request', () => {
      // Initial state
      expect(service.loading()).toBe(false);

      service.loadConsentimientos();

      // Loading should be true during request
      expect(service.loading()).toBe(true);

      const req = httpMock.expectOne(`${service['apiUrl']}`);
      req.flush(mockConsentimientos);

      // Loading should be false after request completes
      expect(service.loading()).toBe(false);
    });
  });
});