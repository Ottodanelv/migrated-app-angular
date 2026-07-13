/**
 * Production environment configuration.
 *
 * Used for `ng build --configuration production`.
 * Values here override the defaults in environment.ts.
 *
 * @source Legacy: WebLogic deployment config (gestionWeb.properties, sociedad-spec properties)
 * @see environment.interface.ts
 */

import type { AppEnvironment } from './environment.interface';

export const environment: AppEnvironment = {
  production: true,

  // -----------------------------------------------------------------------
  // API Configuration
  // Served behind the same origin as the static Angular app.
  // Production hosting must proxy /api/* requests to the backend service.
  // -----------------------------------------------------------------------
  apiBaseUrl: '/api',
  apiTimeout: 15000, // 15s — tighter timeout in production
  apiDefaultContentType: 'application/json',

  // -----------------------------------------------------------------------
  // Society / Multi-brand
  // -----------------------------------------------------------------------
  society: {
    default: '400',
    supported: ['400', '600', '800'] as const,
  },

  // -----------------------------------------------------------------------
  // i18n
  // -----------------------------------------------------------------------
  i18n: {
    defaultLocale: 'es',
    supportedLocales: ['es', 'en'] as const,
    baseNames: ['messages', 'error'] as const,
  },

  // -----------------------------------------------------------------------
  // Feature Flags
  // -----------------------------------------------------------------------
  features: {
    consentimientos: false,
    cotitularSms: false,
  },

  mocks: {
    api: false,
  },

  // -----------------------------------------------------------------------
  // Logging
  // -----------------------------------------------------------------------
  logging: {
    level: 'error', // Only errors in production
  },
};
