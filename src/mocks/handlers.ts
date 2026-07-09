/**
 * MSW request handlers for the financial token management flow.
 *
 * Intercepts API calls made by GestionTokenService and returns
 * realistic mock data inspired by the legacy SOAP WS responses.
 *
 * @see AGENTS.md — legacy GestionTokenBusiness.obtenerInfoSmsFinanciero()
 */

import { http, HttpResponse } from 'msw';
import { MOCK_TOKENS } from './mockData';
import { environment } from '../environments/environment';

/** Base URL for the API — matches `environment.apiBaseUrl` for dev. */
const API_BASE = environment.apiBaseUrl;

/**
 * MSW handlers for the GestionToken flow.
 *
 * Endpoint: GET /api/gestion-token/info-sms-financiero?token=xxxx
 *
 * Returns:
 *   - 200 with OperacionFinanciera payload if token exists
 *   - 200 with valido:false if token is expired
 *   - 404 if token is unknown/missing
 */
export const gestionTokenHandlers = [
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
];
