import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { environment } from '../../../environments/environment';
import { InfoOperacionGenericaComponent } from './info-operacion-generica.component';
import type { Consentimiento } from '../../models/consentimiento';
import type { OperacionGenerica } from '../../models/operacion-generica';

describe('InfoOperacionGenericaComponent', () => {
  const genericApiUrl = `${environment.apiBaseUrl}/gestion-token/info-sms-generico`;
  const consentimientosApiUrl = `${environment.apiBaseUrl}/consentimientos`;

  const mockOperacion: OperacionGenerica = {
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

  const mockConsentimientos: Consentimiento[] = [
    {
      tipoConsentimiento: 'CDAC',
      textoLegal: 'Texto legal',
      textoInfo: 'Texto adicional',
      aceptado: false,
      swTextoInfo: true,
      fchNotaria: '2026-07-09T10:00:00Z',
      obligatorio: true,
      masInfo: true,
    },
  ];

  const mockRoute = {
    snapshot: {
      queryParamMap: {
        _token: null as string | null,
        get(key: string): string | null {
          return key === 'token' ? this._token : null;
        },
      },
    },
  };

  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [InfoOperacionGenericaComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: mockRoute },
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    mockRoute.snapshot.queryParamMap._token = 'GEN-TOKEN-001';
    const fixture = TestBed.createComponent(InfoOperacionGenericaComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show error when token is missing', () => {
    mockRoute.snapshot.queryParamMap._token = null;
    const fixture = TestBed.createComponent(InfoOperacionGenericaComponent);
    const component = fixture.componentInstance;
    component.ngOnInit();

    expect(component['loading']()).toBe(false);
    expect(component['errorMessage']()).toContain('token genérico');
  });

  it('should load generic operation and consentimientos', () => {
    mockRoute.snapshot.queryParamMap._token = 'GEN-TOKEN-001';
    const fixture = TestBed.createComponent(InfoOperacionGenericaComponent);
    const component = fixture.componentInstance;
    component.ngOnInit();

    httpMock.expectOne((r) => r.url === genericApiUrl).flush(mockOperacion);
    httpMock.expectOne((r) => r.url === consentimientosApiUrl).flush(mockConsentimientos);

    expect(component['loading']()).toBe(false);
    expect(component['errorMessage']()).toBeNull();
    expect(component['operacion']()?.tipoToken).toBe('ALERT_CDAT_COT');
    expect(component['consentimientos']().length).toBe(1);
  });
});
