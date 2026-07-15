import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { screen } from '@testing-library/angular';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';

import { appConfig } from './app.config';
import { LEGACY_ROUTE_PATHS, ROUTE_PATHS } from './shared/constants/app.constants';
import { environment } from '../environments/environment';
import { server } from '../mocks/node';
import {
  MOCK_COMPRA_PLAZOS_TOKEN,
  MOCK_GENERIC_OPERATION,
  MOCK_PREAUT_TOKEN,
} from '../mocks/mockData';

describe('App integration flows', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
  });

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [...appConfig.providers],
    });
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  it('should redirect the legacy /infoOperacion entry to the preaut Angular page for COMBOCARD tokens', async () => {
    await RouterTestingHarness.create(
      `/${LEGACY_ROUTE_PATHS.INFO_OPERACION}?token=${MOCK_PREAUT_TOKEN.token}`,
    );

    expect(TestBed.inject(Router).url).toBe(
      `/${ROUTE_PATHS.INFO_OPERACION_PREAUT}?token=${MOCK_PREAUT_TOKEN.token}`,
    );
    expect(await screen.findByText('Información')).toBeTruthy();
  });

  it('should redirect the legacy /infoOperacion entry to the compra-plazos Angular page for installment tokens', async () => {
    await RouterTestingHarness.create(
      `/${LEGACY_ROUTE_PATHS.INFO_OPERACION}?token=${MOCK_COMPRA_PLAZOS_TOKEN.token}`,
    );

    expect(TestBed.inject(Router).url).toBe(
      `/${ROUTE_PATHS.INFO_OPERACION_COMPRA_PLAZOS}?token=${MOCK_COMPRA_PLAZOS_TOKEN.token}`,
    );
    expect(await screen.findByText('Compra a plazos')).toBeTruthy();
  });

  it('should redirect the legacy /infoOperacionGenerica alias to the canonical Angular route', async () => {
    await RouterTestingHarness.create(
      `/${LEGACY_ROUTE_PATHS.INFO_OPERACION_GENERICA}?token=${MOCK_GENERIC_OPERATION.token}`,
    );

    expect(TestBed.inject(Router).url).toBe(
      `/${ROUTE_PATHS.INFO_OPERACION_GENERICA}?token=${MOCK_GENERIC_OPERATION.token}`,
    );
    expect(await screen.findByText('Información del token genérico')).toBeTruthy();
  });

  it('should redirect the legacy /acepCot alias to the canonical Angular route', async () => {
    await RouterTestingHarness.create(
      `/${LEGACY_ROUTE_PATHS.ACEPTAR_COTITULAR}?token=${MOCK_GENERIC_OPERATION.token}`,
    );

    expect(TestBed.inject(Router).url).toBe(
      `/${ROUTE_PATHS.ACEPTAR_COTITULAR}?token=${MOCK_GENERIC_OPERATION.token}`,
    );
    expect(await screen.findByText('Enviar OTP al cotitular')).toBeTruthy();
  });

  it('should redirect the legacy /enviarOtpCotitular alias to the canonical Angular route', async () => {
    await RouterTestingHarness.create(
      `/${LEGACY_ROUTE_PATHS.ENVIAR_OTP_COTITULAR}?token=${MOCK_GENERIC_OPERATION.token}`,
    );

    expect(TestBed.inject(Router).url).toBe(
      `/${ROUTE_PATHS.ACEPTAR_COTITULAR}?token=${MOCK_GENERIC_OPERATION.token}`,
    );
    expect(await screen.findByText('Enviar OTP al cotitular')).toBeTruthy();
  });

  it('should navigate through the generic token flow and submit the OTP form', async () => {
    const harness = await RouterTestingHarness.create(
      `/${ROUTE_PATHS.INFO_OPERACION_GENERICA}?token=${MOCK_GENERIC_OPERATION.token}&sociedad=800`,
    );

    expect(await screen.findByText('Información del token genérico')).toBeTruthy();
    expect(screen.getByText(MOCK_GENERIC_OPERATION.nif)).toBeTruthy();

    const continueLink = screen.getByRole('link', {
      name: 'Continuar con aceptación',
    });

    continueLink.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true }),
    );
    await harness.fixture.whenStable();
    harness.fixture.detectChanges();

    expect(TestBed.inject(Router).url).toBe(
      `/${ROUTE_PATHS.ACEPTAR_COTITULAR}?token=${MOCK_GENERIC_OPERATION.token}&sociedad=800`,
    );
    expect(await screen.findByText('Enviar OTP al cotitular')).toBeTruthy();

    const sendSmsButton = screen.getByRole('button', { name: 'Enviar SMS' });
    sendSmsButton.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true }),
    );
    await harness.fixture.whenStable();
    harness.fixture.detectChanges();

    expect(await screen.findByRole('dialog')).toBeTruthy();
    expect(
      await screen.findByText('La cesión se ha aceptado correctamente.'),
    ).toBeTruthy();
  });

  it('should render the generic token error flow when the backend lookup fails', async () => {
    server.use(
      http.get(`${environment.apiBaseUrl}/gestion-token/info-sms-generico`, () =>
        HttpResponse.json(
          { error: 'Unexpected failure', code: 'GENERIC_FLOW_ERROR' },
          { status: 500 },
        ),
      ),
    );

    await RouterTestingHarness.create(
      `/${ROUTE_PATHS.INFO_OPERACION_GENERICA}?token=${MOCK_GENERIC_OPERATION.token}`,
    );

    expect(
      await screen.findByText('Se ha producido un error al cargar la operación genérica.'),
    ).toBeTruthy();
  });

  it('should redirect unknown routes to the shared error page', async () => {
    await RouterTestingHarness.create('/ruta-que-no-existe');

    expect(TestBed.inject(Router).url).toBe(`/${ROUTE_PATHS.ERROR}`);
    expect(await screen.findByText('Error')).toBeTruthy();
    expect(await screen.findByText('Volver al inicio')).toBeTruthy();
  });
});
