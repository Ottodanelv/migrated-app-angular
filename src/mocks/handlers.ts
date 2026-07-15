/**
 * MSW request handlers for the migrated token-management flows.
 *
 * Intercepts API calls made by the Angular services and returns realistic
 * mock data inspired by the legacy SOAP WS responses.
 *
 * @see AGENTS.md — legacy GestionTokenBusiness.obtenerInfoSmsFinanciero()
 */

import { http, HttpResponse } from 'msw';

import type { SmsOtpRequest } from '../app/core/services/sms.service';
import { environment } from '../environments/environment';
import {
  MOCK_CONSENTIMIENTOS,
  MOCK_GENERIC_TOKENS,
  MOCK_SMS_RESPONSE,
  MOCK_TOKENS,
} from './mockData';

/** Base URL for the API — matches `environment.apiBaseUrl` for dev. */
const API_BASE = environment.apiBaseUrl;

/**
 * MSW handlers for the migrated integration flows.
 *
 * Endpoint: GET /api/token/financiero/{token}
 *
 * Returns:
 *   - 200 with the raw `TokenFinancieroResponse` shape if the token exists
 *     (including an expired `fchCaducidad` for the expired-token fixture)
 *   - 404 if the token is unknown
 *
 * Mirrors the real backend's `TokenController` (path-variable reads) so
 * mocks and the real backend behave the same from the front's point of view.
 */
export const handlers = [
  http.get(`${API_BASE}/token/financiero/:token`, ({ params }) => {
    const token = params['token'] as string;
    const mockData = MOCK_TOKENS[token];

    if (!mockData) {
      return HttpResponse.json(
        { detail: 'Token not found or invalid', errorCode: 'TOKEN_NOT_FOUND' },
        { status: 404 },
      );
    }

    return HttpResponse.json(mockData, { status: 200 });
  }),

  http.get(`${API_BASE}/token/generico/:token`, ({ params }) => {
    const token = params['token'] as string;
    const mockData = MOCK_GENERIC_TOKENS[token];

    if (!mockData) {
      return HttpResponse.json(
        { detail: 'Generic token not found', errorCode: 'TOKEN_NOT_FOUND' },
        { status: 404 },
      );
    }

    return HttpResponse.json(mockData, { status: 200 });
  }),

  http.get(`${API_BASE}/consentimientos`, () =>
    HttpResponse.json(MOCK_CONSENTIMIENTOS, { status: 200 }),
  ),

  http.post(`${API_BASE}/sms/enviar-otp`, async ({ request }) => {
    const body = (await request.json()) as Partial<SmsOtpRequest>;

    if (!body.token || !body.telefono || !body.nif) {
      return HttpResponse.json(
        { detail: 'Missing SMS OTP request fields', errorCode: 'SMS_REQUEST_INVALID' },
        { status: 400 },
      );
    }

    const tokenData = MOCK_GENERIC_TOKENS[body.token];

    if (!tokenData) {
      return HttpResponse.json(
        { detail: 'Unknown generic token', errorCode: 'TOKEN_NOT_FOUND' },
        { status: 404 },
      );
    }

    if (new Date(tokenData.fchFin).getTime() <= Date.now()) {
      return HttpResponse.json(
        { detail: 'Generic token is not valid', errorCode: 'TOKEN_INVALID' },
        { status: 409 },
      );
    }

    return HttpResponse.json(MOCK_SMS_RESPONSE, { status: 200 });
  }),
];

export const gestionTokenHandlers = handlers;
