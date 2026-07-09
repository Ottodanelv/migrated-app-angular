/**
 * Tests for InfoOperacionPreautComponent.
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

import { InfoOperacionPreautComponent } from './info-operacion-preaut.component';
import { environment } from '../../../environments/environment';
import type { OperacionFinanciera } from '../../models/operacion-financiera';

describe('InfoOperacionPreautComponent', () => {
  const mockOperacion: OperacionFinanciera = {
    token: 'COMBO-TOKEN-001',
    importe: 8000.0,
    mensualidad: 333.33,
    meses: 24,
    impTotalAdeudado: 8000.0,
    comision: 75.0,
    fchProximoRecibo: '2026-08-15',
    tin: 5.5,
    tae: 6.1,
    valido: true,
    tipoToken: 'COMBOCARD',
  };

  const apiUrl = `${environment.apiBaseUrl}/gestion-token/info-sms-financiero`;

  let httpMock: HttpTestingController;

  /** Shared mutable mock route — set _token before each test. */
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

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [InfoOperacionPreautComponent],
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
    mockRoute.snapshot.queryParamMap._token = 'COMBO-TOKEN-001';
    const fixture = TestBed.createComponent(InfoOperacionPreautComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show loading state initially', () => {
    mockRoute.snapshot.queryParamMap._token = 'COMBO-TOKEN-001';
    const fixture = TestBed.createComponent(InfoOperacionPreautComponent);
    const ctx = fixture.componentInstance as any;
    ctx.ngOnInit();
    expect(ctx.loading()).toBe(true);
    expect(ctx.operacion()).toBeNull();
    expect(ctx.errorMessage()).toBeNull();

    // Flush the pending request to avoid verify() failure
    httpMock.expectOne((r) => r.url === apiUrl).flush(mockOperacion);
  });

  it('should show error state when token is missing', () => {
    mockRoute.snapshot.queryParamMap._token = null;
    const fixture = TestBed.createComponent(InfoOperacionPreautComponent);
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
    mockRoute.snapshot.queryParamMap._token = 'COMBO-TOKEN-001';
    const fixture = TestBed.createComponent(InfoOperacionPreautComponent);
    const ctx = fixture.componentInstance as any;
    ctx.ngOnInit();

    const req = httpMock.expectOne(
      (r) =>
        r.url === apiUrl &&
        r.params.get('token') === 'COMBO-TOKEN-001',
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockOperacion);

    expect(ctx.loading()).toBe(false);
    expect(ctx.errorMessage()).toBeNull();
    expect(ctx.operacion()).toBeTruthy();
    expect(ctx.operacion()!.token).toBe('COMBO-TOKEN-001');
    expect(ctx.operacion()!.importe).toBe(8000.0);
    expect(ctx.operacion()!.valido).toBe(true);
    expect(ctx.operacion()!.tipoToken).toBe('COMBOCARD');
  });

  it('should set error message on HTTP 404', () => {
    mockRoute.snapshot.queryParamMap._token = 'UNKNOWN-TOKEN';
    const fixture = TestBed.createComponent(InfoOperacionPreautComponent);
    const ctx = fixture.componentInstance as any;
    ctx.ngOnInit();

    const req = httpMock.expectOne(
      (r) =>
        r.url === apiUrl &&
        r.params.get('token') === 'UNKNOWN-TOKEN',
    );
    req.flush('Not found', { status: 404, statusText: 'Not Found' });

    expect(ctx.loading()).toBe(false);
    expect(ctx.operacion()).toBeNull();
    expect(ctx.errorMessage()).toContain('no es válido');
  });

  it('should set generic error message on HTTP 500', () => {
    mockRoute.snapshot.queryParamMap._token = 'COMBO-TOKEN-001';
    const fixture = TestBed.createComponent(InfoOperacionPreautComponent);
    const ctx = fixture.componentInstance as any;
    ctx.ngOnInit();

    const req = httpMock.expectOne(
      (r) =>
        r.url === apiUrl &&
        r.params.get('token') === 'COMBO-TOKEN-001',
    );
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
