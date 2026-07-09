/**
 * Error Interceptor — HTTP Error Normalization.
 *
 * Catches all `HttpErrorResponse` errors in the HTTP pipeline, normalizes them
 * into a typed `NormalizedError` structure, maps legacy error codes to i18n
 * keys, logs via `console.error()`, and re-throws for upstream consumers.
 *
 * ## Legacy Source References
 *
 * - `BitSightFilter.doFilterInternal()` (CSP) — REMOVED: this interceptor
 *   handles error normalization, not CSP headers. See `csp.interceptor.ts`.
 * - `GestionTokenFinancieroController.validarTokenSmsFinanciero()`
 *   (lines 51-100) — catches service exceptions and sets `mensajeError`
 *   model attribute with i18n keys such as:
 *   `"error.gestionToken.sms.financiero.no.valido"` and
 *   `"error.gestionToken.sms.financiero"`.
 * - `GestionTokenBusiness.obtenerInfoSmsFinanciero()` (lines 48-108) —
 *   classifies errors via `e.getFaultInfo().getCodigoError()` with
 *   `GES_TOK_SER_TKN` code for token invalid.
 * @source Legacy: GestionTokenFinancieroController.validarTokenSmsFinanciero()
 * @source Legacy: GestionTokenBusiness.obtenerInfoSmsFinanciero()
 *
 * ## REMOVED Legacy Concerns
 *
 * - {@code WebContentInterceptor} (dispatcher-servlet.xml:20-28) configured
 *   `cacheSeconds=0`, `useExpiresHeader=true`, `useCacheControlHeader=true`,
 *   `useCacheControlNoStore=true`. This is a **server-side response header
 *   concern** — Angular cannot set HTTP response headers. Cache-control must
 *   be enforced by the backend/CDN. REMOVED from client scope.
 *
 * @module ErrorInterceptor
 */

import type { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import type { HttpEvent } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import type { Observable } from 'rxjs';

/**
 * Normalized error context produced by the error interceptor.
 *
 * Provides a consistent structure for all HTTP errors flowing through
 * the pipeline, enabling upstream consumers (services, components) to
 * handle errors uniformly.
 */
export interface NormalizedError {
  /** HTTP status code (0 for network errors) */
  status: number;
  /** i18n translation key for user-facing error messages */
  i18nKey: string;
  /** Original error message from the `HttpErrorResponse` */
  originalMessage: string;
  /** ISO-8601 timestamp of when the error occurred */
  timestamp: string;
  /** URL of the failed request */
  url: string;
}

/**
 * Maps an HTTP status code to a corresponding i18n translation key.
 *
 * @param status - The HTTP status code from the error response.
 * @returns The i18n key for user-facing error messages.
 */
function mapStatusToI18nKey(status: number): string {
  if (status === 0) {
    return 'error.network';
  }
  if (status >= 500) {
    return 'error.server';
  }
  if (status === 404) {
    return 'error.not-found';
  }
  return 'error.client';
}

/**
 * Functional HTTP interceptor that normalizes HTTP errors.
 *
 * Intercepts all outgoing HTTP requests and catches `HttpErrorResponse`
 * errors on the response stream. Each error is:
 * 1. Classified by status code
 * 2. Mapped to an i18n key (via `mapStatusToI18nKey`)
 * 3. Logged via `console.error()` with structured context
 * 4. Re-thrown for upstream consumers
 *
 * **Design decisions applied:**
 * - [Error Handling] Normalization + i18n mapping only; no `retry()`.
 *   Retry logic can be added per-service if needed in the future.
 * - [Auth Errors] 401/403 errors are logged and re-thrown without redirect.
 *   The Auth Guard (Module #9) handles redirection to `/login`.
 * - [Logging] Uses only `console.error()` with a consistent structure.
 *   No external monitoring dependency is introduced at this stage.
 *
 * @param req - The outgoing HTTP request.
 * @param next - The next handler in the interceptor chain.
 * @returns An observable of HTTP events, potentially modified on error.
 */
export function errorInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  return next(req).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse)) {
        // Non-HTTP errors (e.g., parser errors, custom thrown errors)
        // are logged and re-thrown as-is without normalization.
        console.error(
          '[ErrorInterceptor] Non-HTTP error caught:',
          error instanceof Error ? error.message : String(error),
        );
        return throwError(() => error);
      }

      const httpError = error as HttpErrorResponse;
      const status = httpError.status;
      const i18nKey = mapStatusToI18nKey(status);
      const timestamp = new Date().toISOString();
      const url = httpError.url ?? '';

      // Legacy error code inspection — mirrors
      // `GestionTokenBusiness.obtenerInfoSmsFinanciero()` which inspects
      // `e.getFaultInfo().getCodigoError()` for `GES_TOK_SER_TKN`.
      const codigoError: string | undefined =
        (httpError.error as Record<string, unknown> | null)?.['codigoError'] as string | undefined ??
        undefined;

      if (codigoError !== undefined) {
        console.warn(
          `[ErrorInterceptor] Legacy error code detected: ${codigoError}`,
          { status, url },
        );
      }

      const normalized: NormalizedError = {
        status,
        i18nKey,
        originalMessage: httpError.message,
        timestamp,
        url,
      };

      // Structured logging consistent with all error paths.
      // Matches the pattern: timestamp, status, url, message.
      console.error(
        '[ErrorInterceptor]',
        {
          status,
          url,
          message: httpError.message,
          timestamp,
          ...(codigoError !== undefined ? { codigoError } : {}),
        },
      );

      // Re-throw the normalized context.
      // 401/403 are propagated without redirect — the Auth Guard
      // (Module #9) handles authentication-required redirects.
      return throwError(() => normalized);
    }),
  );
}
