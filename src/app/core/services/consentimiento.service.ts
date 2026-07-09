/**
 * Consentimiento Service — Consent Management.
 *
 * Provides methods for fetching and managing user consents (legal/regulatory).
 * Replaces legacy `ConsentimientoBusiness.java` which called
 * `ConsentimientoServicePortType.obtenerConsentimientos()` via SOAP.
 *
 * ## Legacy Source References
 *
 * - `ConsentimientoBusiness.obtenerConsentimiento()` (lines 35-49)
 *   calls `consentimientoService.obtenerConsentimientos(request)` and
 *   maps response via `consentimientoConverter.converterConsentimientos()`.
 * - `ConsentimientoConverter.consentimientoBO()` (lines 44-51) maps
 *   SOAP response objects to `ConsentimientoBO` fields.
 *
 * ## Migration Decisions
 *
 * - SOAP → REST: Single `HttpClient.get<Consentimiento[]>()` call.
 * - `ConsentimientoConverter` logic → inline mapping (fields already match).
 * - Error handling: `ConsentimientoServiceException` → HTTP error interceptor.
 * - State management: Signal-based for reactive UI updates.
 *
 * @source Legacy: ConsentimientoBusiness.java
 * @source Legacy: ConsentimientoConverter.java
 */

import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, finalize, of, tap } from 'rxjs';
import { Consentimiento } from '../../models/consentimiento';
import { environment } from '../../../environments/environment';

/**
 * Service for managing user consents.
 *
 * Usage:
 * ```typescript
 * private readonly consentimientoService = inject(ConsentimientoService);
 *
 * // Load consents
 * this.consentimientoService.obtenerConsentimientos().subscribe(consentimientos => {
 *   // Handle consentimientos
 * });
 *
 * // Or use signals for reactive state
 * this.consentimientoService.loadConsentimientos();
 * const consentimientos = this.consentimientoService.consentimientos();
 * const loading = this.consentimientoService.loading();
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class ConsentimientoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/consentimientos`;

  /** Signal containing the current list of consents. */
  readonly consentimientos = signal<Consentimiento[]>([]);

  /** Signal indicating whether a request is in progress. */
  readonly loading = signal(false);

  /** Signal containing the last error, if any. */
  readonly error = signal<string | null>(null);

  /**
   * Fetches all consents for the current user.
   *
   * @returns Observable of Consentimiento array.
   */
  obtenerConsentimientos(): Observable<Consentimiento[]> {
    return this.http.get<Consentimiento[]>(this.apiUrl);
  }

  /**
   * Loads consents into the service signals.
   *
   * Updates `consentimientos`, `loading`, and `error` signals.
   */
  loadConsentimientos(): void {
    this.loading.set(true);
    this.error.set(null);

    this.obtenerConsentimientos()
      .pipe(
        tap((consentimientos) => {
          this.consentimientos.set(consentimientos);
        }),
        catchError((error) => {
          this.error.set('Error loading consents');
          return of([]);
        }),
        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe();
  }
}