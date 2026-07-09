/**
 * Global Error Handler — Centralized Error Handling.
 *
 * Implements Angular's `ErrorHandler` interface for centralized error handling.
 * Replaces legacy `error.jsp` and controller try-catch patterns.
 *
 * ## Legacy Source References
 *
 * - `error.jsp` — Generic error page for 404, 500, and unhandled exceptions.
 * - Controller try-catch patterns — `GestionTokenFinancieroController.validarTokenSmsFinanciero()`
 *   catches service exceptions and sets `mensajeError` model attribute.
 *
 * ## Migration Decisions
 *
 * - `error.jsp` → `ErrorComponent` routed via wildcard (already implemented).
 * - Controller try-catch → handled by HTTP interceptor + ErrorHandler.
 * - Error message codes → i18n keys in error handler.
 *
 * @source Legacy: error.jsp
 * @source Legacy: GestionTokenFinancieroController.java
 */

import { ErrorHandler, Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Global error handler for the application.
 *
 * Catches all unhandled errors and routes to the error page.
 *
 * Usage:
 * ```typescript
 * // In app.config.ts
 * providers: [
 *   { provide: ErrorHandler, useClass: GlobalErrorHandler },
 * ]
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandler implements ErrorHandler {
  private readonly router = inject(Router);

  /**
   * Handles an unhandled error.
   *
   * @param error - The unhandled error.
   */
  handleError(error: unknown): void {
    console.error('[GlobalErrorHandler] Unhandled error:', error);

    // Navigate to error page (matches legacy error.jsp)
    // Only navigate if not already on error page to avoid infinite loops
    if (!this.router.url.startsWith('/error')) {
      this.router.navigate(['/error']);
    }
  }
}