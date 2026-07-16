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
 * - SOAP → REST: `HttpClient.post<ObtenerConsentimientosResponse>()` call
 *   against the real backend's `POST /consentimientos`, which requires the
 *   list of consent types to check and the society — unlike the front's
 *   original (invented) parameterless `GET`.
 * - Response envelope (`{ consentimientos: ConsentimientoDto[] }`) is
 *   unwrapped into a plain array for the front.
 * - UI-only fields (`aceptado`, `swTextoInfo`, `obligatorio`, `masInfo`) are
 *   not sent by the backend — they're derived with safe defaults in
 *   `toConsentimiento()` until a real source for them is defined.
 * - Error handling: `ConsentimientoServiceException` → HTTP error interceptor.
 * - State management: Signal-based for reactive UI updates.
 *
 * @source Legacy: ConsentimientoBusiness.java
 * @source Legacy: ConsentimientoConverter.java
 */

import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, catchError, finalize, of, tap } from 'rxjs';
import { Consentimiento } from '../../models/consentimiento';
import { environment } from '../../../environments/environment';

/** Raw shape returned by the backend's `ConsentimientoDto`. */
interface ConsentimientoApiResponse {
  idConsentimiento: string;
  tipoConsentimiento: string;
  ambito: string;
  version: string;
  textoLegal: string;
  textoInfo: string;
  fchNotaria: string;
}

/** Envelope returned by the backend's `ObtenerConsentimientosResponse`. */
interface ObtenerConsentimientosApiResponse {
  consentimientos: ConsentimientoApiResponse[];
}

/**
 * Maps the backend's `ConsentimientoDto` to the front's `Consentimiento`.
 *
 * `obligatorio`, `aceptado` and `swTextoInfo` have no backend source yet —
 * default to `false`. `masInfo` is derived from whether `textoInfo` is
 * present, preserving the existing "ver más info" UI behavior.
 */
function toConsentimiento(response: ConsentimientoApiResponse): Consentimiento {
  return {
    tipoConsentimiento: response.tipoConsentimiento,
    textoLegal: response.textoLegal,
    textoInfo: response.textoInfo,
    aceptado: false,
    swTextoInfo: false,
    fchNotaria: response.fchNotaria,
    obligatorio: false,
    masInfo: Boolean(response.textoInfo),
    idConsentimiento: response.idConsentimiento,
    ambito: response.ambito,
    version: response.version,
  };
}

/**
 * Service for managing user consents.
 *
 * Usage:
 * ```typescript
 * private readonly consentimientoService = inject(ConsentimientoService);
 *
 * // Load consents
 * this.consentimientoService.obtenerConsentimientos(['CDAC'], '800').subscribe(consentimientos => {
 *   // Handle consentimientos
 * });
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
   * Fetches the consents of the given types for a society.
   *
   * Calls the real backend's `POST /consentimientos` (it requires a body —
   * there's no parameterless read) and unwraps the `{ consentimientos }`
   * envelope into a plain array mapped to the front's `Consentimiento`.
   *
   * @param consentimientos - Consent type ids to check (e.g. `['CDAC']`).
   * @param sociedad - Society code (`'400'`, `'600'`, `'800'`).
   */
  obtenerConsentimientos(
    consentimientos: string[],
    sociedad: string,
  ): Observable<Consentimiento[]> {
    return this.http
      .post<ObtenerConsentimientosApiResponse>(this.apiUrl, {
        consentimientos,
        sociedad,
      })
      .pipe(map((response) => response.consentimientos.map(toConsentimiento)));
  }

  /**
   * Loads consents into the service signals.
   *
   * Updates `consentimientos`, `loading`, and `error` signals.
   */
  loadConsentimientos(consentimientos: string[], sociedad: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.obtenerConsentimientos(consentimientos, sociedad)
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
