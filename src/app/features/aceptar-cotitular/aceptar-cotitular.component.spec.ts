import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { environment } from '../../../environments/environment';
import { OperacionGenericaStateService } from '../../core/services/operacion-generica-state.service';
import type { OperacionGenerica } from '../../models/operacion-generica';
import { AceptarCotitularComponent } from './aceptar-cotitular.component';

describe('AceptarCotitularComponent', () => {
  const smsApiUrl = `${environment.apiBaseUrl}/sms/enviar-otp`;
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

  const mockRoute = {
    snapshot: {
      queryParamMap: {
        get(): string | null {
          return 'GEN-TOKEN-001';
        },
      },
    },
  };

  let httpMock: HttpTestingController;
  let state: OperacionGenericaStateService;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [AceptarCotitularComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: mockRoute },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    state = TestBed.inject(OperacionGenericaStateService);
    state.setOperacion(mockOperacion);
  });

  afterEach(() => {
    state.clear();
    httpMock.verify();
  });

  it('should be created', () => {
    const fixture = TestBed.createComponent(AceptarCotitularComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should hydrate the form from state on init', () => {
    const fixture = TestBed.createComponent(AceptarCotitularComponent);
    const ctx = fixture.componentInstance as any;
    ctx.ngOnInit();

    expect(ctx.operacion()?.telefono).toBe('600123123');
    expect(ctx.form.getRawValue().telefono).toBe('600123123');
  });

  it('should open success modal when SMS is sent', () => {
    const fixture = TestBed.createComponent(AceptarCotitularComponent);
    const ctx = fixture.componentInstance as any;
    ctx.ngOnInit();
    ctx.enviarSms();

    const req = httpMock.expectOne((r) => r.url === smsApiUrl);
    expect(req.request.method).toBe('POST');
    req.flush({ enviado: true });

    expect(ctx.showSuccessModal()).toBe(true);
    expect(ctx.errorMessage()).toBeNull();
  });
});
