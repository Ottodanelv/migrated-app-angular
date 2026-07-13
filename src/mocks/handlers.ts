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
 * Endpoint: GET /api/gestion-token/info-sms-financiero?token=xxxx
 *
 * Returns:
 *   - 200 with OperacionFinanciera payload if token exists
 *   - 200 with valido:false if token is expired
 *   - 404 if token is unknown/missing
 */
export const handlers = [
  http.get(`${API_BASE}/gestion-token/info-sms-financiero`, ({ request }) => {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return HttpResponse.json(
        { error: 'Token parameter is required', code: 'TOKEN_MISSING' },
        { status: 400 },
      );
    }

    const mockData = MOCK_TOKENS[token];

    if (!mockData) {
      return HttpResponse.json(
        { error: 'Token not found or invalid', code: 'TOKEN_NOT_FOUND' },
        { status: 404 },
      );
    }

    return HttpResponse.json(mockData, { status: 200 });
  }),

  http.get(`${API_BASE}/gestion-token/info-sms-generico`, ({ request }) => {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return HttpResponse.json(
        { error: 'Token parameter is required', code: 'TOKEN_MISSING' },
        { status: 400 },
      );
    }

    const mockData = MOCK_GENERIC_TOKENS[token];

    if (!mockData) {
      return HttpResponse.json(
        { error: 'Generic token not found', code: 'TOKEN_NOT_FOUND' },
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
        { error: 'Missing SMS OTP request fields', code: 'SMS_REQUEST_INVALID' },
        { status: 400 },
      );
    }

    const tokenData = MOCK_GENERIC_TOKENS[body.token];

    if (!tokenData) {
      return HttpResponse.json(
        { error: 'Unknown generic token', code: 'TOKEN_NOT_FOUND' },
        { status: 404 },
      );
    }

    if (!tokenData.valido) {
      return HttpResponse.json(
        { error: 'Generic token is not valid', code: 'TOKEN_INVALID' },
        { status: 409 },
      );
    }

    return HttpResponse.json(MOCK_SMS_RESPONSE, { status: 200 });
  }),
];

export const gestionTokenHandlers = handlers;
