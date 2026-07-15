/**
 * Tests for the Error Interceptor.
 *
 * Verifies that `errorInterceptor` normalizes HTTP errors into a typed
 * `NormalizedError` structure, maps status codes to i18n keys, logs via
 * `console.error()`, and re-throws for upstream consumers.
 *
 * @see errorInterceptor
 * @see NormalizedError
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
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
import { errorInterceptor, type NormalizedError } from './error.interceptor';

describe('errorInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should pass through successful responses unchanged', async () => {
    // Arrange
    const testData = { id: 1, name: 'test' };

    // Act
    const result$ = httpClient.get<{ id: number; name: string }>('/api/test');
    const resultPromise = new Promise<{ id: number; name: string }>((resolve) => {
      result$.subscribe((data) => resolve(data));
    });

    // Assert
    const req = httpMock.expectOne('/api/test');
    expect(req.request.method).toBe('GET');
    req.flush(testData);

    const result = await resultPromise;
    expect(result).toEqual(testData);
  });

  it('should normalize 500 error to server error key', async () => {
    // Arrange
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Act
    const result$ = httpClient.get('/api/error');
    const errorPromise = new Promise<NormalizedError>((resolve) => {
      result$.subscribe({
        error: (err: NormalizedError) => resolve(err),
      });
    });

    // Assert
    const req = httpMock.expectOne('/api/error');
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

    const error = await errorPromise;
    expect(error.status).toBe(500);
    expect(error.i18nKey).toBe('error.server');
    expect(error.url).toBe('/api/error');
    expect(error.timestamp).toBeDefined();

    // Verify console.error was called with structured context
    expect(consoleSpy).toHaveBeenCalledWith(
      '[ErrorInterceptor]',
      expect.objectContaining({
        status: 500,
        url: '/api/error',
      }),
    );

    consoleSpy.mockRestore();
  });

  it('should normalize 404 error to not-found key', async () => {
    // Arrange
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Act
    const result$ = httpClient.get('/api/not-found');
    const errorPromise = new Promise<NormalizedError>((resolve) => {
      result$.subscribe({
        error: (err: NormalizedError) => resolve(err),
      });
    });

    // Assert
    const req = httpMock.expectOne('/api/not-found');
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });

    const error = await errorPromise;
    expect(error.status).toBe(404);
    expect(error.i18nKey).toBe('error.not-found');
    expect(error.url).toBe('/api/not-found');

    consoleSpy.mockRestore();
  });

  it('should re-throw 401 without redirect', async () => {
    // Arrange
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Act
    const result$ = httpClient.get('/api/unauthorized');
    const errorPromise = new Promise<NormalizedError>((resolve) => {
      result$.subscribe({
        error: (err: NormalizedError) => resolve(err),
      });
    });

    // Assert
    const req = httpMock.expectOne('/api/unauthorized');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    const error = await errorPromise;
    expect(error.status).toBe(401);
    expect(error.i18nKey).toBe('error.client');

    consoleSpy.mockRestore();
  });

  it('should re-throw 403 without redirect', async () => {
    // Arrange
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Act
    const result$ = httpClient.get('/api/forbidden');
    const errorPromise = new Promise<NormalizedError>((resolve) => {
      result$.subscribe({
        error: (err: NormalizedError) => resolve(err),
      });
    });

    // Assert
    const req = httpMock.expectOne('/api/forbidden');
    req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });

    const error = await errorPromise;
    expect(error.status).toBe(403);
    expect(error.i18nKey).toBe('error.client');

    consoleSpy.mockRestore();
  });

  it('should handle network error (status 0)', async () => {
    // Arrange
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Act
    const result$ = httpClient.get('/api/network-error');
    const errorPromise = new Promise<NormalizedError>((resolve) => {
      result$.subscribe({
        error: (err: NormalizedError) => resolve(err),
      });
    });

    // Assert
    const req = httpMock.expectOne('/api/network-error');
    req.error(new ProgressEvent('Network error'));

    const error = await errorPromise;
    expect(error.status).toBe(0);
    expect(error.i18nKey).toBe('error.network');
    expect(error.timestamp).toBeDefined();

    consoleSpy.mockRestore();
  });

  it('should log error with structured console.error', async () => {
    // Arrange
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const testUrl = '/api/structured-log';

    // Act
    const result$ = httpClient.get(testUrl);
    const errorPromise = new Promise<NormalizedError>((resolve) => {
      result$.subscribe({
        error: (err: NormalizedError) => resolve(err),
      });
    });

    // Assert
    const req = httpMock.expectOne(testUrl);
    req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });

    await errorPromise;

    // Verify the structured log shape
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const callArgs = consoleSpy.mock.calls[0];
    expect(callArgs[0]).toBe('[ErrorInterceptor]');
    expect(callArgs[1]).toHaveProperty('status', 400);
    expect(callArgs[1]).toHaveProperty('url', testUrl);
    expect(callArgs[1]).toHaveProperty('message');
    expect(callArgs[1]).toHaveProperty('timestamp');

    consoleSpy.mockRestore();
  });

  it('should detect errorCode from a ProblemDetail response body', async () => {
    // Arrange
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Act
    const result$ = httpClient.get('/api/business-error');
    const errorPromise = new Promise<NormalizedError>((resolve) => {
      result$.subscribe({
        error: (err: NormalizedError) => resolve(err),
      });
    });

    // Assert
    const req = httpMock.expectOne('/api/business-error');
    req.flush(
      {
        type: 'about:blank',
        title: 'Token no válido',
        status: 400,
        detail: 'El token financiero ha caducado',
        instance: '/api/business-error',
        errorCode: 'GES_TOK_SER_TKN',
      },
      { status: 400, statusText: 'Bad Request' },
    );

    const error = await errorPromise;
    expect(error.status).toBe(400);
    expect(error.i18nKey).toBe('error.client');
    expect(error.errorCode).toBe('GES_TOK_SER_TKN');
    expect(error.title).toBe('Token no válido');
    expect(error.detail).toBe('El token financiero ha caducado');

    // Verify business error code warning
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      '[ErrorInterceptor] Business error code detected: GES_TOK_SER_TKN',
      expect.any(Object),
    );

    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });
});
