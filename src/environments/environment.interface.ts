/**
 * Type-safe environment interface.
 *
 * All environment files (environment.ts, environment.prod.ts, etc.) must
 * implement this interface to ensure consistency across build configurations.
 *
 * @source Legacy: applicationContext.xml (Spring PropertyPlaceHolder),
 *                 gestionWeb-context.xml (messageSource, localeResolver, contentNegotiation)
 * @see migration-plan.md#3-environment-configuration
 */

import type { SocietyCode } from '../app/shared/constants/app.constants';

/** Supported locales for i18n. */
export type SupportedLocale = 'es' | 'en';

/** Log level configuration. */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'none';

/**
 * Application environment configuration.
 *
 * Extracted from legacy Spring XML + .properties files:
 *   - applicationContext.xml   → api.*, society.*
 *   - gestionWeb-context.xml   → i18n.*, api.defaultContentType
 *   - gestionWeb.properties    → (empty; placeholder only)
 *   - registry-context.xml     → (empty; WebLogic registry stub)
 */
export interface AppEnvironment {
  /** Whether this is a production build. Angular standard flag. */
  production: boolean;

  /** Base URL for the REST API backend (replaces SOAP WS endpoints). */
  apiBaseUrl: string;

  /** HTTP request timeout in milliseconds. */
  apiTimeout: number;

  /**
   * Default content type for API requests.
   * @source contentNegotiationManager in gestionWeb-context.xml
   */
  apiDefaultContentType: string;

  /**
   * Society / brand configuration.
   * @source CustomPropertyPlaceHolder loading sociedad-spec/environment-context.properties
   */
  society: {
    /** Default society code when none is provided. */
    default: SocietyCode;
    /** All supported society codes. */
    supported: readonly SocietyCode[];
  };

  /**
   * Internationalization configuration.
   * @source messageSource + localeResolver in gestionWeb-context.xml
   */
  i18n: {
    /** Default locale for the application. */
    defaultLocale: SupportedLocale;
    /** Available locales. */
    supportedLocales: readonly SupportedLocale[];
    /**
     * Message bundle base names.
     * @source messageSource basenames: "messages/messages", "messages/error"
     */
    baseNames: readonly string[];
  };

  /**
   * Feature flags — toggle functionality per environment or society.
   * Placeholder values; will be refined as features are migrated.
   */
  features: {
    /** Enable consent management UI (sociedad 800 — Xfera only). */
    consentimientos: boolean;
    /** Enable co-holder SMS OTP flow. */
    cotitularSms: boolean;
  };

  /**
   * Logging configuration.
   * @source logback.xml (not directly migrated; simplified)
   */
  logging: {
    /** Minimum log level to display. */
    level: LogLevel;
  };
}
