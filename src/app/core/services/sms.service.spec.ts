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
    telefono: '+34600000000',
    sociedad: '400',
    token: 'TOKEN-001',
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

      const req = httpMock.expectOne(`${service['apiUrl']}/enviar-otp`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockRequest);
      req.flush({ enviado: true });
    });

    it('should send SMS and return false when API returns false', () => {
      service.enviarSmsOtp(mockRequest).subscribe((enviado) => {
        expect(enviado).toBe(false);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/enviar-otp`);
      req.flush({ enviado: false });
    });

    it('should handle HTTP error and return false', () => {
      service.enviarSmsOtp(mockRequest).subscribe((enviado) => {
        expect(enviado).toBe(false);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/enviar-otp`);
      req.error(new ProgressEvent('error'));
    });

    it('should send correct request body', () => {
      service.enviarSmsOtp(mockRequest).subscribe();

      const req = httpMock.expectOne(`${service['apiUrl']}/enviar-otp`);
      expect(req.request.body).toEqual(mockRequest);
      req.flush({ enviado: true });
    });

    it('should handle request with optional parameters', () => {
      const requestWithParams: SmsOtpRequest = {
        ...mockRequest,
        parametros: { key1: 'value1', key2: 'value2' },
      };

      service.enviarSmsOtp(requestWithParams).subscribe();

      const req = httpMock.expectOne(`${service['apiUrl']}/enviar-otp`);
      expect(req.request.body).toEqual(requestWithParams);
      req.flush({ enviado: true });
    });
  });
});