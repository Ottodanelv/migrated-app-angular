/**
 * Development environment configuration.
 *
 * Used by default for `ng serve` and `ng build --configuration development`.
 *
 * @source Legacy: applicationContext.xml + gestionWeb-context.xml
 * @see environment.interface.ts
 */

import type { AppEnvironment } from './environment.interface';

export const environment: AppEnvironment = {
  production: false,

  // -----------------------------------------------------------------------
  // API Configuration
  // @source: SOAP WS endpoints in client-context.xml (now REST)
  // -----------------------------------------------------------------------
  apiBaseUrl: 'http://localhost:8080/api',
  apiTimeout: 30000, // 30s — generous for local dev
  apiDefaultContentType: 'application/json',

  // -----------------------------------------------------------------------
  // Society / Multi-brand
  // @source: CustomPropertyPlaceHolder → sociedad-spec/environment-context.properties
  // -----------------------------------------------------------------------
  society: {
    default: '400', // Cetelem (default brand)
    supported: ['400', '600', '800'] as const,
  },

  // -----------------------------------------------------------------------
  // i18n
  // @source: messageSource + localeResolver in gestionWeb-context.xml
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

  // -----------------------------------------------------------------------
  // Logging
  // @source: logback.xml (simplified)
  // -----------------------------------------------------------------------
  logging: {
    level: 'debug', // Verbose logging in development
  },
};
