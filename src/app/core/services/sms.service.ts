/**
 * SMS Service — OTP SMS Sending.
 *
 * Provides methods for sending OTP SMS messages to users.
 * Replaces legacy `SmsBusiness.java` which called
 * `SmsServicePortType.enviarSmsOtpPorDatosGenericos()` via SOAP.
 *
 * ## Legacy Source References
 *
 * - `SmsBusiness.enviarSmsOtpPorDatosGenericos()` (lines 27-56)
 *   calls `smsServicePortType.enviarSmsOtpPorDatosGenericos(parameters)`
 *   and returns `enviarSmsOtpPorDatosGenericosResponse.isEnviado()`.
 *
 * ## Migration Decisions
 *
 * - SOAP → REST: `HttpClient.post<{enviado: boolean}>()` call against the
 *   real backend's `POST /sms/token-generico` (`EmitirTokenGenericoRequest`
 *   → `EnviarSmsTokenGenericoResponse`), not the front's originally invented
 *   `/sms/enviar-otp`. This endpoint was chosen over the more generic
 *   `/sms/otp/datos-genericos` because its fields match what the cotitular
 *   flow already carries on `OperacionGenerica` almost 1:1 (nif, sociedad,
 *   telefono, aplicacionFk, codigoNotifFk, cadenaFk, tipoToken,
 *   tipoAutenticacionFk) and its response shape (`{ enviado: boolean }`)
 *   requires no UI changes.
 * - Request object → typed function parameters.
 * - Boolean return → Observable<boolean>.
 * - Error handling: `SmsServiceException` → HTTP error interceptor.
 *
 * @source Legacy: SmsBusiness.java
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, map } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Request parameters for sending OTP SMS via the generic token flow.
 *
 * Mirrors the real backend's `EmitirTokenGenericoRequest`
 * (`POST /sms/token-generico`).
 */
export interface SmsOtpRequest {
  /** User's NIF (tax identification number) */
  readonly nif: string;
  /** Society code (400, 600, 800) */
  readonly sociedad: string;
  /** User's phone number */
  readonly telefono: string;
  /** Legacy clienteFk used by the cotitular flow */
  readonly clienteFk?: string;
  /** Legacy aplicacion FK used by cotitular flow */
  readonly aplicacionFk: string;
  /** Legacy codigoNotif FK used by cotitular flow */
  readonly codigoNotifFk: string;
  /** Legacy cadena FK used by the cotitular flow */
  readonly cadenaFk?: string;
  /** Token type classifier */
  readonly tipoToken?: string;
  /** Legacy tipoAutenticacion FK used by cotitular flow */
  readonly tipoAutenticacionFk: string;
}

/**
 * Service for sending OTP SMS messages.
 *
 * Usage:
 * ```typescript
 * private readonly smsService = inject(SmsService);
 *
 * // Send OTP SMS
 * this.smsService.enviarSmsOtp(request).subscribe(enviado => {
 *   if (enviado) {
 *     // SMS sent successfully
 *   }
 * });
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class SmsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/sms`;

  /**
   * Emits/refreshes a generic token and sends its OTP SMS to the given
   * phone number.
   *
   * @param request - SMS request parameters.
   * @returns Observable<boolean> indicating whether the SMS was sent successfully.
   */
  enviarSmsOtp(request: SmsOtpRequest): Observable<boolean> {
    return this.http.post<{ enviado: boolean }>(`${this.apiUrl}/token-generico`, request).pipe(
      map((response) => response.enviado),
      catchError((error) => {
        console.error('[SmsService] Error sending OTP SMS:', error);
        return of(false);
      }),
    );
  }
}
