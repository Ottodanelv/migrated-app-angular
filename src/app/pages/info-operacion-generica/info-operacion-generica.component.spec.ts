import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { environment } from '../../../environments/environment';
import { InfoOperacionGenericaComponent } from './info-operacion-generica.component';

describe('InfoOperacionGenericaComponent', () => {
  const genericApiUrl = `${environment.apiBaseUrl}/token/generico/GEN-TOKEN-001`;
  const consentimientosApiUrl = `${environment.apiBaseUrl}/consentimientos`;

  /** Raw shape returned by the real backend's `TokenGenericoResponse`. */
  const mockOperacion = {
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

  /** Raw envelope returned by the real backend's `ObtenerConsentimientosResponse`. */
  const mockConsentimientosResponse = {
    consentimientos: [
      {
        idConsentimiento: 'CDAC-1',
        tipoConsentimiento: 'CDAC',
        ambito: 'COTITULAR',
        version: '1',
        textoLegal: 'Texto legal',
        textoInfo: 'Texto adicional',
        fchNotaria: '2026-07-09',
      },
    ],
  };

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

    const consentimientosReq = httpMock.expectOne((r) => r.url === consentimientosApiUrl);
    expect(consentimientosReq.request.method).toBe('POST');
    expect(consentimientosReq.request.body).toEqual({ consentimientos: ['CDAC'], sociedad: '400' });
    consentimientosReq.flush(mockConsentimientosResponse);

    expect(component['loading']()).toBe(false);
    expect(component['errorMessage']()).toBeNull();
    expect(component['operacion']()?.tipoToken).toBe('ALERT_CDAT_COT');
    expect(component['consentimientos']().length).toBe(1);
  });
});
