import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import {
  provideRouter,
  Router,
  UrlTree,
  convertToParamMap,
  type ActivatedRouteSnapshot,
  type RouterStateSnapshot,
} from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom, type Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { tokenTypeRouteGuard } from './token-type-route.guard';
import { ROUTE_PATHS } from '../../shared/constants/app.constants';

describe('tokenTypeRouteGuard', () => {
  const apiUrl = (token: string) =>
    `${environment.apiBaseUrl}/token/financiero/${token}`;

  /** Minimal raw `TokenFinancieroResponse`-shaped fixture with a given tipoToken. */
  const apiResponse = (token: string, tipoToken: string) => ({
    token,
    tipoToken,
    fchCaducidad: '2099-01-01T00:00:00Z',
  });

  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function createRouteSnapshot(token?: string, society?: string): Partial<ActivatedRouteSnapshot> {
    return {
      queryParamMap: convertToParamMap({
        ...(token ? { token } : {}),
        ...(society ? { sociedad: society } : {}),
      }),
    };
  }

  const routerStateSnapshot = {} as RouterStateSnapshot;

  it('should allow navigation when the token query param is missing', () => {
    const result = TestBed.runInInjectionContext(() =>
      tokenTypeRouteGuard(createRouteSnapshot() as ActivatedRouteSnapshot, routerStateSnapshot),
    );

    expect(result).toBe(true);
  });

  it('should redirect COMBOCARD tokens to the preaut route', async () => {
    const routerSpy = vi.spyOn(router, 'createUrlTree');

    const result$ = TestBed.runInInjectionContext(() =>
      tokenTypeRouteGuard(createRouteSnapshot('FIN-TOKEN-001') as ActivatedRouteSnapshot, routerStateSnapshot),
    );

    const resultPromise = firstValueFrom(result$ as Observable<boolean | UrlTree>);

    httpMock
      .expectOne((request) => request.url === apiUrl('FIN-TOKEN-001'))
      .flush(apiResponse('FIN-TOKEN-001', 'COMBOCARD'));

    const result = await resultPromise;

    expect(routerSpy).toHaveBeenCalledWith(['/', ROUTE_PATHS.INFO_OPERACION_PREAUT], {
      queryParams: { token: 'FIN-TOKEN-001' },
    });
    expect(result).toBeDefined();
  });

  it('should redirect COMPRA_PLAZO_TARJ tokens to the compra-plazos route', async () => {
    const routerSpy = vi.spyOn(router, 'createUrlTree');

    const result$ = TestBed.runInInjectionContext(() =>
      tokenTypeRouteGuard(createRouteSnapshot('FIN-TOKEN-003') as ActivatedRouteSnapshot, routerStateSnapshot),
    );

    const resultPromise = firstValueFrom(result$ as Observable<boolean | UrlTree>);

    httpMock
      .expectOne((request) => request.url === apiUrl('FIN-TOKEN-003'))
      .flush(apiResponse('FIN-TOKEN-003', 'COMPRA_PLAZO_TARJ'));

    await resultPromise;

    expect(routerSpy).toHaveBeenCalledWith(['/', ROUTE_PATHS.INFO_OPERACION_COMPRA_PLAZOS], {
      queryParams: { token: 'FIN-TOKEN-003' },
    });
  });

  it('should preserve the society when redirecting by token type', async () => {
    const routerSpy = vi.spyOn(router, 'createUrlTree');

    const result$ = TestBed.runInInjectionContext(() =>
      tokenTypeRouteGuard(
        createRouteSnapshot('FIN-TOKEN-003', '800') as ActivatedRouteSnapshot,
        routerStateSnapshot,
      ),
    );

    const resultPromise = firstValueFrom(result$ as Observable<boolean | UrlTree>);

    httpMock
      .expectOne((request) => request.url === apiUrl('FIN-TOKEN-003'))
      .flush(apiResponse('FIN-TOKEN-003', 'COMPRA_PLAZO_TARJ'));

    await resultPromise;

    expect(routerSpy).toHaveBeenCalledWith(['/', ROUTE_PATHS.INFO_OPERACION_COMPRA_PLAZOS], {
      queryParams: { token: 'FIN-TOKEN-003', sociedad: '800' },
    });
  });

  it('should redirect ALERT_CDAT_COT tokens to the generic route', async () => {
    const routerSpy = vi.spyOn(router, 'createUrlTree');

    const result$ = TestBed.runInInjectionContext(() =>
      tokenTypeRouteGuard(createRouteSnapshot('GEN-TOKEN-001') as ActivatedRouteSnapshot, routerStateSnapshot),
    );

    const resultPromise = firstValueFrom(result$ as Observable<boolean | UrlTree>);

    httpMock
      .expectOne((request) => request.url === apiUrl('GEN-TOKEN-001'))
      .flush(apiResponse('GEN-TOKEN-001', 'ALERT_CDAT_COT'));

    await resultPromise;

    expect(routerSpy).toHaveBeenCalledWith(['/', ROUTE_PATHS.INFO_OPERACION_GENERICA], {
      queryParams: { token: 'GEN-TOKEN-001' },
    });
  });

  it('should keep the default financial route for unknown token types', async () => {
    const result$ = TestBed.runInInjectionContext(() =>
      tokenTypeRouteGuard(createRouteSnapshot('FIN-TOKEN-002') as ActivatedRouteSnapshot, routerStateSnapshot),
    );

    const resultPromise = firstValueFrom(result$ as Observable<boolean | UrlTree>);

    httpMock
      .expectOne((request) => request.url === apiUrl('FIN-TOKEN-002'))
      .flush(apiResponse('FIN-TOKEN-002', 'UNKNOWN_FUTURE_TYPE'));

    await expect(resultPromise).resolves.toBe(true);
  });

  it('should allow navigation when the token lookup fails', async () => {
    const result$ = TestBed.runInInjectionContext(() =>
      tokenTypeRouteGuard(createRouteSnapshot('BROKEN-TOKEN') as ActivatedRouteSnapshot, routerStateSnapshot),
    );

    const resultPromise = firstValueFrom(result$ as Observable<boolean | UrlTree>);

    httpMock
      .expectOne((request) => request.url === apiUrl('BROKEN-TOKEN'))
      .flush('error', { status: 500, statusText: 'Server Error' });

    await expect(resultPromise).resolves.toBe(true);
  });
});
