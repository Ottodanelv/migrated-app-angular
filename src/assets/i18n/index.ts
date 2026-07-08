/**
 * i18n Translation Registry
 *
 * Available locales and their corresponding XLIFF translation files.
 * Migrated from legacy Java properties files (error.properties, messages.properties).
 *
 * Usage:
 *   import { localeConfig, SUPPORTED_LOCALES } from './assets/i18n';
 *
 * Adding a new locale:
 *   1. Create messages.{locale}.xlf in this directory
 *   2. Add the locale to SUPPORTED_LOCALES and localeConfig below
 *   3. Add the locale to angular.json → projects.migrated-app.i18n.locales
 *   4. Run `ng extract-i18n` to update the source file if needed
 */

/** Supported locale identifiers */
export const SUPPORTED_LOCALES = ['es', 'en'] as const;

/** Default/source locale (Spanish) */
export const DEFAULT_LOCALE = 'es';

/** Locale display names for UI selectors */
export const LOCALE_LABELS: Record<string, string> = {
  es: 'Español',
  en: 'English',
};

/** Locale configuration mapping */
export const localeConfig: Record<string, { translation: string; label: string }> = {
  es: {
    translation: 'messages.es.xlf',
    label: 'Español',
  },
  en: {
    translation: 'messages.en.xlf',
    label: 'English',
  },
};

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
