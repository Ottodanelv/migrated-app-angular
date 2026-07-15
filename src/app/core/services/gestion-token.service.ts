/**
 * Core service for financial token management.
 *
 * Migrated from legacy GestionTokenBusiness.obtenerInfoSmsFinanciero()
 * and GestionTokenFinancieroController.validarTokenSmsFinanciero().
 *
 * Replaces the SOAP WS calls (gestionTokenService) with REST API calls
 * via Angular HttpClient, against the real backend `TokenController`
 * (`GET /token/financiero/{token}`, `GET /token/generico/{token}`).
 *
 * @source Legacy:
 *   - GestionTokenBusiness.obtenerInfoSmsFinanciero(String token)
 *   - GestionTokenFinancieroController.validarTokenSmsFinanciero()
 */

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import type { OperacionFinanciera } from '../../models/operacion-financiera';
import type { OperacionGenerica } from '../../models/operacion-generica';
import type { TokenType } from '../../models/token-type';

/** API path for the financial token read endpoint (path-variable form). */
const TOKEN_FINANCIERO_PATH = 'token/financiero';
/** API path for the generic token read endpoint (path-variable form). */
const TOKEN_GENERICO_PATH = 'token/generico';

/** Raw shape returned by the backend's `TokenFinancieroResponse`. */
interface TokenFinancieroApiResponse {
  token: string;
  sociedad: string;
  nif: string;
  telefono: string;
  meses: number;
  mensualidad: number;
  comision: number;
  importe: number;
  impTotalAdeudado: number;
  tin: number;
  tae: number;
  fchProximoRecibo: string;
  tipoToken: string;
  fchAlta: string;
  fchCaducidad: string;
  numUsos: number;
}

/** Raw shape returned by the backend's `TokenGenericoResponse`. */
interface TokenGenericoApiResponse {
  token: string;
  sociedad: string;
  nif: string;
  telefono: string;
  numUsos: number;
  fchInicio: string;
  fchFin: string;
  clienteFk: string;
  aplicacionFk: string;
  codigoNotifFk: string;
  cadenaFk: string;
  impDispMin: number;
  tipoToken: string;
  tipoAutenticacionFk: string;
}

/** Maps the backend's `TokenFinancieroResponse` to the front's `OperacionFinanciera`. */
function toOperacionFinanciera(
  response: TokenFinancieroApiResponse,
): OperacionFinanciera {
  return {
    token: response.token,
    importe: response.importe,
    mensualidad: response.mensualidad,
    meses: response.meses,
    impTotalAdeudado: response.impTotalAdeudado,
    comision: response.comision,
    fchProximoRecibo: response.fchProximoRecibo,
    tin: response.tin,
    tae: response.tae,
    valido: new Date(response.fchCaducidad).getTime() > Date.now(),
    tipoToken: response.tipoToken as TokenType,
    fchAlta: response.fchAlta,
    fchCaducidad: response.fchCaducidad,
    numUsos: response.numUsos,
  };
}

/** Maps the backend's `TokenGenericoResponse` to the front's `OperacionGenerica`. */
function toOperacionGenerica(
  response: TokenGenericoApiResponse,
): OperacionGenerica {
  return {
    token: response.token,
    nif: response.nif,
    telefono: response.telefono,
    aplicacionFk: response.aplicacionFk,
    codigoNotifFk: response.codigoNotifFk,
    cadenaFk: response.cadenaFk,
    tipoToken: response.tipoToken as TokenType,
    tipoAutenticacionFk: response.tipoAutenticacionFk,
    valido: new Date(response.fchFin).getTime() > Date.now(),
    fchInicio: response.fchInicio,
    fchFin: response.fchFin,
    numUsos: response.numUsos,
  };
}

/**
 * Service that provides financial and generic token lookup operations.
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
   * Retrieves financial operation data for a given token.
   *
   * Equivalent to legacy:
   *   `GestionTokenBusiness.obtenerInfoSmsFinanciero(token)`
   *
   * Calls the real backend's read-only endpoint
   * (`GET /token/financiero/{token}`) and derives `valido` from
   * `fchCaducidad`, since the backend does not send that boolean directly.
   *
   * @param token - The financial token to look up
   * @returns Observable of the financial operation data
   */
  obtenerInfoSmsFinanciero(token: string): Observable<OperacionFinanciera> {
    return this.http
      .get<TokenFinancieroApiResponse>(
        `${environment.apiBaseUrl}/${TOKEN_FINANCIERO_PATH}/${token}`,
      )
      .pipe(map(toOperacionFinanciera));
  }

  /**
   * Retrieves generic operation data for a given token.
   *
   * Equivalent to legacy:
   *   `GestionTokenBusiness.utilizarInfoSmsGenerico(token)`
   *
   * Calls the real backend's read-only endpoint
   * (`GET /token/generico/{token}`) and derives `valido` from `fchFin`.
   */
  utilizarInfoSmsGenerico(token: string): Observable<OperacionGenerica> {
    return this.http
      .get<TokenGenericoApiResponse>(
        `${environment.apiBaseUrl}/${TOKEN_GENERICO_PATH}/${token}`,
      )
      .pipe(map(toOperacionGenerica));
  }
}
