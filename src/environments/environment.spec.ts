/**
 * Unit tests for environment configuration.
 *
 * Validates that all environment files are type-safe, consistent,
 * and correctly mapped from legacy Spring XML configuration.
 *
 * @see migration-plan.md#3-environment-configuration
 */

import { describe, it, expect } from 'vitest';

import type { AppEnvironment } from './environment.interface';
import { environment as devEnv } from './environment';
import { environment as prodEnv } from './environment.prod';

// ---------------------------------------------------------------------------
// Type Safety
// ---------------------------------------------------------------------------

describe('Environment interface', () => {
  it('should have all required keys in development environment', () => {
    const requiredKeys: (keyof AppEnvironment)[] = [
      'production',
      'apiBaseUrl',
      'apiTimeout',
      'apiDefaultContentType',
      'society',
      'i18n',
      'features',
      'logging',
    ];
    for (const key of requiredKeys) {
      expect(devEnv[key]).toBeDefined();
    }
  });

  it('should have all required keys in production environment', () => {
    const requiredKeys: (keyof AppEnvironment)[] = [
      'production',
      'apiBaseUrl',
      'apiTimeout',
      'apiDefaultContentType',
      'society',
      'i18n',
      'features',
      'logging',
    ];
    for (const key of requiredKeys) {
      expect(prodEnv[key]).toBeDefined();
    }
  });
});

// ---------------------------------------------------------------------------
// Development Environment
// ---------------------------------------------------------------------------

describe('Development environment', () => {
  it('should have production set to false', () => {
    expect(devEnv.production).toBe(false);
  });

  it('should use localhost API base URL', () => {
    expect(devEnv.apiBaseUrl).toContain('localhost');
  });

  it('should have generous timeout for local dev (>= 20s)', () => {
    expect(devEnv.apiTimeout).toBeGreaterThanOrEqual(20000);
  });

  it('should use debug log level', () => {
    expect(devEnv.logging.level).toBe('debug');
  });

  it('should have feature flags disabled by default', () => {
    expect(devEnv.features.consentimientos).toBe(false);
    expect(devEnv.features.cotitularSms).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Production Environment
// ---------------------------------------------------------------------------

describe('Production environment', () => {
  it('should have production set to true', () => {
    expect(prodEnv.production).toBe(true);
  });

  it('should use relative API base URL (same-origin)', () => {
    expect(prodEnv.apiBaseUrl).toBe('/api');
  });

  it('should have tighter timeout (<= 20s)', () => {
    expect(prodEnv.apiTimeout).toBeLessThanOrEqual(20000);
  });

  it('should use error log level', () => {
    expect(prodEnv.logging.level).toBe('error');
  });

  it('should have feature flags disabled in production', () => {
    // Features are opt-in; production enables them after migration verification
    expect(prodEnv.features.consentimientos).toBe(false);
    expect(prodEnv.features.cotitularSms).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Society / Multi-brand (from applicationContext.xml)
// ---------------------------------------------------------------------------

describe('Society configuration', () => {
  it('should have society codes 400, 600, 800 in both environments', () => {
    const expected = ['400', '600', '800'];
    for (const env of [devEnv, prodEnv]) {
      expect(env.society.supported).toEqual(expected);
      expect(expected).toContain(env.society.default);
    }
  });

  it('should default to society 400 (Cetelem)', () => {
    expect(devEnv.society.default).toBe('400');
    expect(prodEnv.society.default).toBe('400');
  });
});

// ---------------------------------------------------------------------------
// i18n (from gestionWeb-context.xml messageSource + localeResolver)
// ---------------------------------------------------------------------------

describe('i18n configuration', () => {
  it('should default to Spanish locale (legacy default)', () => {
    // @source localeResolver defaultLocale = "es"
    expect(devEnv.i18n.defaultLocale).toBe('es');
    expect(prodEnv.i18n.defaultLocale).toBe('es');
  });

  it('should support Spanish and English', () => {
    for (const env of [devEnv, prodEnv]) {
      expect(env.i18n.supportedLocales).toContain('es');
      expect(env.i18n.supportedLocales).toContain('en');
    }
  });

  it('should have message and error base names (legacy bundles)', () => {
    // @source messageSource basenames: "messages/messages", "messages/error"
    for (const env of [devEnv, prodEnv]) {
      expect(env.i18n.baseNames).toContain('messages');
      expect(env.i18n.baseNames).toContain('error');
    }
  });
});

// ---------------------------------------------------------------------------
// API Configuration (from contentNegotiationManager)
// ---------------------------------------------------------------------------

describe('API configuration', () => {
  it('should use application/json as default content type', () => {
    // @source contentNegotiationManager mediaTypes: json=application/json
    expect(devEnv.apiDefaultContentType).toBe('application/json');
    expect(prodEnv.apiDefaultContentType).toBe('application/json');
  });

  it('should have valid API base URLs', () => {
    for (const env of [devEnv, prodEnv]) {
      expect(env.apiBaseUrl).toBeTruthy();
      expect(env.apiBaseUrl.length).toBeGreaterThan(0);
      // Should not end with a slash (clean URL convention)
      expect(env.apiBaseUrl).not.toMatch(/\/$/);
    }
  });
});

// ---------------------------------------------------------------------------
// Production vs Development Differences
// ---------------------------------------------------------------------------

describe('Production vs Development differences', () => {
  it('should differ on production flag', () => {
    expect(devEnv.production).not.toBe(prodEnv.production);
  });

  it('should differ on log level (dev=debug, prod=error)', () => {
    expect(devEnv.logging.level).not.toBe(prodEnv.logging.level);
  });

  it('should differ on API timeout (dev more generous)', () => {
    expect(devEnv.apiTimeout).toBeGreaterThan(prodEnv.apiTimeout);
  });

  it('should share same society config', () => {
    expect(devEnv.society.default).toBe(prodEnv.society.default);
  });

  it('should share same i18n config', () => {
    expect(devEnv.i18n).toEqual(prodEnv.i18n);
  });
});

// ---------------------------------------------------------------------------
// REMOVED markers — legacy concepts not migrated
// ---------------------------------------------------------------------------

describe('Legacy concepts (REMOVED)', () => {
  it('should not include WebLogic registry config (registry-context.xml was empty)', () => {
    // registry-context.xml was a stub with no beans — REMOVED entirely
    expect('registry' in devEnv).toBe(false);
    expect('weblogic' in devEnv).toBe(false);
  });

  it('should not include Spring PropertyPlaceHolder (replaced by Angular fileReplacements)', () => {
    // CustomPropertyPlaceHolder → angular.json fileReplacements
    expect('propertyPlaceholder' in devEnv).toBe(false);
  });

  it('should not include Spring validator config (replaced by Angular Validators)', () => {
    // LocalValidatorFactoryBean → REMOVED; Angular Validators handle this
    expect('validator' in devEnv).toBe(false);
  });
});
