/**
 * SmsService Tests
 *
 * Tests for the SmsService which sends OTP SMS messages.
 * Uses Vitest with Angular testing utilities.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { SmsService, SmsOtpRequest } from './sms.service';

describe('SmsService', () => {
  let service: SmsService;
  let httpMock: HttpTestingController;

  const mockRequest: SmsOtpRequest = {
    nif: '12345678A',
    sociedad: '400',
    telefono: '+34600000000',
    aplicacionFk: 'APP01',
    codigoNotifFk: 'ALERT_CDAT_COT',
    tipoAutenticacionFk: 'SMS',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withFetch()),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(SmsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('enviarSmsOtp', () => {
    it('should send SMS and return true on success', () => {
      service.enviarSmsOtp(mockRequest).subscribe((enviado) => {
        expect(enviado).toBe(true);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/token-generico`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockRequest);
      req.flush({ enviado: true });
    });

    it('should send SMS and return false when API returns false', () => {
      service.enviarSmsOtp(mockRequest).subscribe((enviado) => {
        expect(enviado).toBe(false);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/token-generico`);
      req.flush({ enviado: false });
    });

    it('should handle HTTP error and return false', () => {
      service.enviarSmsOtp(mockRequest).subscribe((enviado) => {
        expect(enviado).toBe(false);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/token-generico`);
      req.error(new ProgressEvent('error'));
    });

    it('should send correct request body', () => {
      service.enviarSmsOtp(mockRequest).subscribe();

      const req = httpMock.expectOne(`${service['apiUrl']}/token-generico`);
      expect(req.request.body).toEqual(mockRequest);
      req.flush({ enviado: true });
    });

    it('should handle request with optional fields', () => {
      const requestWithOptionalFields: SmsOtpRequest = {
        ...mockRequest,
        clienteFk: 'CLI01',
        cadenaFk: 'CAD01',
        tipoToken: 'ALERT_CDAT_COT',
      };

      service.enviarSmsOtp(requestWithOptionalFields).subscribe();

      const req = httpMock.expectOne(`${service['apiUrl']}/token-generico`);
      expect(req.request.body).toEqual(requestWithOptionalFields);
      req.flush({ enviado: true });
    });
  });
});
