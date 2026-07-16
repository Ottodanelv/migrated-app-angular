/**
 * Tests for InfoOperacionComponent.
 *
 * Validates:
 *   - Loading state while fetching data
 *   - Error state when token is missing
 *   - Error state when HTTP fails
 *   - Success state with financial data
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { InfoOperacionComponent } from './info-operacion.component';
import { environment } from '../../../environments/environment';

describe('InfoOperacionComponent', () => {
  /** Raw shape returned by the real backend's `TokenFinancieroResponse`. */
  const mockOperacion = {
    token: 'FIN-TOKEN-001',
    sociedad: '400',
    nif: '12345678A',
    telefono: '600123123',
    importe: 12500.0,
    mensualidad: 347.22,
    meses: 36,
    impTotalAdeudado: 12000.0,
    comision: 150.0,
    fchProximoRecibo: '2026-08-15',
    tin: 4.75,
    tae: 5.12,
    tipoToken: 'COMBOCARD',
    fchAlta: '2026-01-01T00:00:00Z',
    fchCaducidad: '2099-01-01T00:00:00Z',
    numUsos: 0,
  };

  const apiUrl = (token: string) =>
    `${environment.apiBaseUrl}/token/financiero/${token}`;

  let httpMock: HttpTestingController;

  /** Shared mutable mock route — set _token before each test. */
  const mockRoute = {
    snapshot: {
      queryParamMap: {
        _token: null as string | null,
        _sociedad: null as string | null,
        get(key: string): string | null {
          if (key === 'token') {
            return this._token;
          }

          return key === 'sociedad' ? this._sociedad : null;
        },
      },
    },
  };

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [InfoOperacionComponent],
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
    mockRoute.snapshot.queryParamMap._token = 'FIN-TOKEN-001';
    const fixture = TestBed.createComponent(InfoOperacionComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show loading state initially', () => {
    mockRoute.snapshot.queryParamMap._token = 'FIN-TOKEN-001';
    const fixture = TestBed.createComponent(InfoOperacionComponent);
    const ctx = fixture.componentInstance as any;
    ctx.ngOnInit();
    expect(ctx.loading()).toBe(true);
    expect(ctx.operacion()).toBeNull();
    expect(ctx.errorMessage()).toBeNull();

    // Flush the pending request to avoid verify() failure
    httpMock.expectOne((r) => r.url === apiUrl('FIN-TOKEN-001')).flush(mockOperacion);
  });

  it('should show error state when token is missing', () => {
    mockRoute.snapshot.queryParamMap._token = null;
    const fixture = TestBed.createComponent(InfoOperacionComponent);
    const ctx = fixture.componentInstance as any;
    ctx.ngOnInit();

    expect(ctx.loading()).toBe(false);
    expect(ctx.operacion()).toBeNull();
    expect(ctx.errorMessage()).toBe(
      'No se ha proporcionado un token de operación.',
    );

    // No HTTP request was made — nothing to flush
  });

  it('should fetch and display operacion data on success', () => {
    mockRoute.snapshot.queryParamMap._token = 'FIN-TOKEN-001';
    const fixture = TestBed.createComponent(InfoOperacionComponent);
    const ctx = fixture.componentInstance as any;
    ctx.ngOnInit();

    const req = httpMock.expectOne((r) => r.url === apiUrl('FIN-TOKEN-001'));
    expect(req.request.method).toBe('GET');
    req.flush(mockOperacion);

    expect(ctx.loading()).toBe(false);
    expect(ctx.errorMessage()).toBeNull();
    expect(ctx.operacion()).toBeTruthy();
    expect(ctx.operacion()!.token).toBe('FIN-TOKEN-001');
    expect(ctx.operacion()!.importe).toBe(12500.0);
    expect(ctx.operacion()!.valido).toBe(true);
  });

  it('should render the legacy narrative copy for the default society', () => {
    mockRoute.snapshot.queryParamMap._token = 'FIN-TOKEN-001';
    const fixture = TestBed.createComponent(InfoOperacionComponent);
    fixture.detectChanges();

    const req = httpMock.expectOne((r) => r.url === apiUrl('FIN-TOKEN-001'));
    req.flush(mockOperacion);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Información');
    expect(text).toContain('Ha realizado una utilización de tarjeta');
    expect(text).toContain('Espacio Cliente');
    expect(text).toContain('Ir a cetelem.es');
  });

  it('should set error message on HTTP 404', () => {
    mockRoute.snapshot.queryParamMap._token = 'UNKNOWN-TOKEN';
    const fixture = TestBed.createComponent(InfoOperacionComponent);
    const ctx = fixture.componentInstance as any;
    ctx.ngOnInit();

    const req = httpMock.expectOne((r) => r.url === apiUrl('UNKNOWN-TOKEN'));
    req.flush('Not found', { status: 404, statusText: 'Not Found' });

    expect(ctx.loading()).toBe(false);
    expect(ctx.operacion()).toBeNull();
    expect(ctx.errorMessage()).toContain('no es válido');
  });

  it('should set generic error message on HTTP 500', () => {
    mockRoute.snapshot.queryParamMap._token = 'FIN-TOKEN-001';
    const fixture = TestBed.createComponent(InfoOperacionComponent);
    const ctx = fixture.componentInstance as any;
    ctx.ngOnInit();

    const req = httpMock.expectOne((r) => r.url === apiUrl('FIN-TOKEN-001'));
    req.flush('Server error', {
      status: 500,
      statusText: 'Internal Server Error',
    });

    expect(ctx.loading()).toBe(false);
    expect(ctx.operacion()).toBeNull();
    expect(ctx.errorMessage()).toContain(
      'Se ha producido un error',
    );
  });
});
