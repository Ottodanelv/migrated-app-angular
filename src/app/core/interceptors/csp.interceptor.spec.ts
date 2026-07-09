/**
 * Tests for the CSP/Security Interceptor.
 *
 * Verifies that `cspInterceptor` passes all requests and responses through
 * unmodified, serving as a pure documentation placeholder with no
 * side-effects on the HTTP pipeline.
 *
 * @see cspInterceptor
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import {
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { cspInterceptor } from './csp.interceptor';

describe('cspInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([cspInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should pass through requests unmodified', async () => {
    // Arrange
    const testData = { result: 'ok' };

    // Act
    const result$ = httpClient.get<{ result: string }>('/api/test');
    const resultPromise = new Promise<{ result: string }>((resolve) => {
      result$.subscribe((data) => resolve(data));
    });

    // Assert
    const req = httpMock.expectOne('/api/test');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers).toBeDefined();
    // Verify no unexpected headers were added by the interceptor
    expect(req.request.headers.keys().length).toBe(0);
    req.flush(testData);

    const result = await resultPromise;
    expect(result).toEqual(testData);
  });

  it('should pass through successful responses unmodified', async () => {
    // Arrange
    const testPayload = { id: 42, name: 'test-item' };

    // Act
    const result$ = httpClient.post<{ id: number; name: string }>('/api/create', { name: 'test-item' });
    const resultPromise = new Promise<{ id: number; name: string }>((resolve) => {
      result$.subscribe((data) => resolve(data));
    });

    // Assert
    const req = httpMock.expectOne('/api/create');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name: 'test-item' });
    req.flush(testPayload);

    const result = await resultPromise;
    expect(result).toEqual(testPayload);
  });

  it('should pass through error responses unmodified', async () => {
    // Arrange
    const result$ = httpClient.get('/api/error');
    const errorPromise = new Promise<HttpErrorResponse>((resolve) => {
      result$.subscribe({
        error: (err: HttpErrorResponse) => resolve(err),
      });
    });

    // Assert
    const req = httpMock.expectOne('/api/error');
    req.flush('Internal Error', { status: 500, statusText: 'Server Error' });

    const error = await errorPromise;
    expect(error).toBeInstanceOf(HttpErrorResponse);
    expect(error.status).toBe(500);
    expect(error.statusText).toBe('Server Error');
  });

  it('should preserve request headers through passthrough', async () => {
    // Arrange
    const result$ = httpClient.get('/api/with-headers', {
      headers: { 'X-Custom-Header': 'test-value' },
    });
    const resultPromise = new Promise<unknown>((resolve) => {
      result$.subscribe((data) => resolve(data));
    });

    // Assert
    const req = httpMock.expectOne('/api/with-headers');
    expect(req.request.headers.get('X-Custom-Header')).toBe('test-value');
    req.flush({});

    await resultPromise;
  });
});
