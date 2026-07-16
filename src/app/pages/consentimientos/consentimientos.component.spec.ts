import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { environment } from '../../../environments/environment';
import { ConsentimientosComponent } from './consentimientos.component';

describe('ConsentimientosComponent', () => {
  const consentimientosApiUrl = `${environment.apiBaseUrl}/consentimientos`;

  /** Raw envelope returned by the real backend's `ObtenerConsentimientosResponse`. */
  const mockConsentimientosResponse = {
    consentimientos: [
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
    ],
  };

  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [ConsentimientosComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    const fixture = TestBed.createComponent(ConsentimientosComponent);
    expect(fixture.componentInstance).toBeTruthy();

    fixture.detectChanges();
    httpMock.expectOne((request) => request.url === consentimientosApiUrl).flush({ consentimientos: [] });
  });

  it('should load and render consentimientos summary', () => {
    const fixture = TestBed.createComponent(ConsentimientosComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    const req = httpMock.expectOne((request) => request.url === consentimientosApiUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockConsentimientosResponse);
    fixture.detectChanges();

    expect(component['loading']()).toBe(false);
    expect(component['errorMessage']()).toBeNull();
    expect(component['consentimientos']().length).toBe(2);
    // `aceptado` has no backend source yet — defaults to false for every consent.
    expect(component['acceptedCount']()).toBe(0);
    expect(fixture.nativeElement.textContent).toContain('Gestión de consentimientos');
    expect(fixture.nativeElement.textContent).toContain('INTERCONEXION');
  });

  it('should open consent modal when detail button is clicked', () => {
    const fixture = TestBed.createComponent(ConsentimientosComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    httpMock.expectOne((request) => request.url === consentimientosApiUrl).flush(mockConsentimientosResponse);
    fixture.detectChanges();

    const detailButton = fixture.nativeElement.querySelector('button');
    detailButton.click();
    fixture.detectChanges();

    expect(component['showModal']()).toBe(true);
    expect(component['selectedConsentimiento']()?.tipoConsentimiento).toBe('CDAC');
    expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeTruthy();
  });

  it('should show error when request fails', () => {
    const fixture = TestBed.createComponent(ConsentimientosComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    httpMock.expectOne((request) => request.url === consentimientosApiUrl).flush('error', {
      status: 500,
      statusText: 'Server Error',
    });
    fixture.detectChanges();

    expect(component['loading']()).toBe(false);
    expect(component['errorMessage']()).toContain('consentimientos');
    expect(component['consentimientos']()).toEqual([]);
  });
});
