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

describe('tokenTypeRouteGuard', () => {
  const apiUrl = `${environment.apiBaseUrl}/gestion-token/info-sms-financiero`;

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

  function createRouteSnapshot(token?: string): Partial<ActivatedRouteSnapshot> {
    return {
      queryParamMap: convertToParamMap(token ? { token } : {}),
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
      .expectOne((request) => request.url === apiUrl && request.params.get('token') === 'FIN-TOKEN-001')
      .flush({ token: 'FIN-TOKEN-001', valido: true, tipoToken: 'COMBOCARD' });

    const result = await resultPromise;

    expect(routerSpy).toHaveBeenCalledWith(['/','info-operacion-preaut'], {
      queryParams: { token: 'FIN-TOKEN-001' },
    });
    expect(result).toBeDefined();
  });

  it('should keep the default financial route for unknown token types', async () => {
    const result$ = TestBed.runInInjectionContext(() =>
      tokenTypeRouteGuard(createRouteSnapshot('FIN-TOKEN-002') as ActivatedRouteSnapshot, routerStateSnapshot),
    );

    const resultPromise = firstValueFrom(result$ as Observable<boolean | UrlTree>);

    httpMock
      .expectOne((request) => request.url === apiUrl && request.params.get('token') === 'FIN-TOKEN-002')
      .flush({ token: 'FIN-TOKEN-002', valido: true, tipoToken: 'UNKNOWN_FUTURE_TYPE' });

    await expect(resultPromise).resolves.toBe(true);
  });

  it('should allow navigation when the token lookup fails', async () => {
    const result$ = TestBed.runInInjectionContext(() =>
      tokenTypeRouteGuard(createRouteSnapshot('BROKEN-TOKEN') as ActivatedRouteSnapshot, routerStateSnapshot),
    );

    const resultPromise = firstValueFrom(result$ as Observable<boolean | UrlTree>);

    httpMock
      .expectOne((request) => request.url === apiUrl && request.params.get('token') === 'BROKEN-TOKEN')
      .flush('error', { status: 500, statusText: 'Server Error' });

    await expect(resultPromise).resolves.toBe(true);
  });
});
