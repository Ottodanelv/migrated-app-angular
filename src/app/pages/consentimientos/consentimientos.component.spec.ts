import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { environment } from '../../../environments/environment';
import type { Consentimiento } from '../../models/consentimiento';
import { ConsentimientosComponent } from './consentimientos.component';

describe('ConsentimientosComponent', () => {
  const consentimientosApiUrl = `${environment.apiBaseUrl}/consentimientos`;

  const mockConsentimientos: Consentimiento[] = [
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
    httpMock.expectOne((request) => request.url === consentimientosApiUrl).flush([]);
  });

  it('should load and render consentimientos summary', () => {
    const fixture = TestBed.createComponent(ConsentimientosComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    httpMock.expectOne((request) => request.url === consentimientosApiUrl).flush(mockConsentimientos);
    fixture.detectChanges();

    expect(component['loading']()).toBe(false);
    expect(component['errorMessage']()).toBeNull();
    expect(component['consentimientos']().length).toBe(2);
    expect(component['acceptedCount']()).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('Gestión de consentimientos');
    expect(fixture.nativeElement.textContent).toContain('INTERCONEXION');
  });

  it('should open consent modal when detail button is clicked', () => {
    const fixture = TestBed.createComponent(ConsentimientosComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    httpMock.expectOne((request) => request.url === consentimientosApiUrl).flush(mockConsentimientos);
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
