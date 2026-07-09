/**
 * Core service for financial token management.
 *
 * Migrated from legacy GestionTokenBusiness.obtenerInfoSmsFinanciero()
 * and GestionTokenFinancieroController.validarTokenSmsFinanciero().
 *
 * Replaces the SOAP WS calls (gestionTokenService) with REST API calls
 * via Angular HttpClient.
 *
 * @source Legacy:
 *   - GestionTokenBusiness.obtenerInfoSmsFinanciero(String token)
 *   - GestionTokenFinancieroController.validarTokenSmsFinanciero()
 */

import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import type { OperacionFinanciera } from '../../models/operacion-financiera';

/** API path for the financial SMS info endpoint. */
const INFO_SMS_FINANCIERO_PATH = 'gestion-token/info-sms-financiero';

/**
 * Service that provides financial token lookup operations.
 *
 * Usage:
 * ```typescript
 * const service = inject(GestionTokenService);
 * service.obtenerInfoSmsFinanciero('token-123').subscribe(data => ...);
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class GestionTokenService {
  private readonly http = inject(HttpClient);

  /**
   * Retrieves financial operation data for a given SMS token.
   *
   * Equivalent to legacy:
   *   `GestionTokenBusiness.obtenerInfoSmsFinanciero(token)`
   *
   * @param token - The financial SMS token to look up
   * @returns Observable of the financial operation data
   *
   * On the server side (legacy), this would:
   * 1. Call `recuperarInfoTokenSmsFinanciero` to get token data
   * 2. Optionally call `utilizarTokenSmsFinanciero` to consume the token
   * 3. Map the response into an OperacionFinancieraBO
   *
   * In the Angular app, this is a single REST GET call.
   */
  obtenerInfoSmsFinanciero(token: string): Observable<OperacionFinanciera> {
    const params = new HttpParams().set('token', token);

    return this.http.get<OperacionFinanciera>(
      `${environment.apiBaseUrl}/${INFO_SMS_FINANCIERO_PATH}`,
      { params },
    );
  }
}
