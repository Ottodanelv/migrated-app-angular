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
 * - SOAP → REST: `HttpClient.post<{enviado: boolean}>()` call.
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
 * Request parameters for sending OTP SMS.
 */
export interface SmsOtpRequest {
  /** User's NIF (tax identification number) */
  readonly nif: string;
  /** User's phone number */
  readonly telefono: string;
  /** Society code (400, 600, 800) */
  readonly sociedad: string;
  /** Token identifier */
  readonly token: string;
  /** Legacy aplicacion FK used by cotitular flow */
  readonly aplicacion?: string;
  /** Legacy tipoAutenticacion FK used by cotitular flow */
  readonly tipoAutenticacion?: string;
  /** Legacy codigoNotif FK used by cotitular flow */
  readonly codigoNotif?: string;
  /** Additional parameters as key-value pairs */
  readonly parametros?: Record<string, string>;
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
   * Sends an OTP SMS to the specified phone number.
   *
   * @param request - SMS request parameters.
   * @returns Observable<boolean> indicating whether the SMS was sent successfully.
   */
  enviarSmsOtp(request: SmsOtpRequest): Observable<boolean> {
    return this.http.post<{ enviado: boolean }>(`${this.apiUrl}/enviar-otp`, request).pipe(
      map((response) => response.enviado),
      catchError((error) => {
        console.error('[SmsService] Error sending OTP SMS:', error);
        return of(false);
      }),
    );
  }
}
