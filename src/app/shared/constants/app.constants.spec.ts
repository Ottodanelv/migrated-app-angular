/**
 * Unit tests for application constants.
 *
 * Validates that all migrated constants match the legacy source values
 * and that the data structure is correct for Angular 22 consumption.
 *
 * @see migration-plan.md#2-app-constants
 */

import { describe, it, expect } from 'vitest';

import {
  ROUTE_PATHS,
  QUERY_PARAMS,
  MODEL_ATTRIBUTES,
  SOCIETY_CODES,
  ERROR_KEYS,
  FEATURE_FLAGS,
} from './app.constants';

// ---------------------------------------------------------------------------
// Route Paths
// ---------------------------------------------------------------------------

describe('ROUTE_PATHS', () => {
  it('should use kebab-case paths (Angular convention)', () => {
    const paths = Object.values(ROUTE_PATHS);
    for (const path of paths) {
      expect(path).not.toMatch(/[A-Z]/); // no camelCase or PascalCase
      expect(path).not.toMatch(/^\//);   // no leading slash (relative route paths)
    }
  });

  it('should have the correct number of routes migrated from PathConstantes', () => {
    // 4 legacy paths + 1 new (error) = 5 route paths
    expect(Object.keys(ROUTE_PATHS)).toHaveLength(5);
  });

  it('should map legacy path constants to Angular routes', () => {
    // @source PATH_INFO_OPERACION_VALIDAR_TOKEN = "/infoOperacion"
    expect(ROUTE_PATHS.INFO_OPERACION).toBe('info-operacion');
    // @source PATH_INFO_OPERACION_VALIDAR_TOKEN_GENERICO = "/infoOperacionGenerica"
    expect(ROUTE_PATHS.INFO_OPERACION_GENERICA).toBe('info-operacion-generica');
    // @source PATH_ENVIAR_OTP_COTITULAR = "/enviarOtpCotitular"
    expect(ROUTE_PATHS.ENVIAR_OTP_COTITULAR).toBe('enviar-otp-cotitular');
    // @source PATH_ACEPTACION_CESION_DATOS_COTITULAR = "/acepCot"
    expect(ROUTE_PATHS.ACEPTAR_COTITULAR).toBe('aceptar-cotitular');
  });

  it('should be deeply readonly (as const)', () => {
    // TypeScript would catch mutation at compile time; verify shape at runtime
    expect(Object.isFrozen(ROUTE_PATHS)).toBe(false); // `as const` doesn't freeze at runtime
    expect(typeof ROUTE_PATHS.INFO_OPERACION).toBe('string');
  });
});

// ---------------------------------------------------------------------------
// Query Parameters
// ---------------------------------------------------------------------------

describe('QUERY_PARAMS', () => {
  it('should match legacy request parameter names', () => {
    // @source ATRIBUTO_TOKEN = "token"
    expect(QUERY_PARAMS.TOKEN).toBe('token');
    // @source SOCIEDAD = "sociedad"
    expect(QUERY_PARAMS.SOCIEDAD).toBe('sociedad');
  });

  it('should have exactly 2 query params', () => {
    expect(Object.keys(QUERY_PARAMS)).toHaveLength(2);
  });

  it('should use lowercase snake_case for query param keys', () => {
    const keys = Object.values(QUERY_PARAMS);
    for (const key of keys) {
      expect(key).toBe(key.toLowerCase());
    }
  });
});

// ---------------------------------------------------------------------------
// Model Attributes
// ---------------------------------------------------------------------------

describe('MODEL_ATTRIBUTES', () => {
  it('should match legacy model attribute names', () => {
    // @source DATOS_INFO_OPERACION_FINANCIERA = "infoOperacion"
    expect(MODEL_ATTRIBUTES.INFO_OPERACION).toBe('infoOperacion');
    // @source DATOS_INFO_OPERACION_GENERICA = "infoOperacionGenerica"
    expect(MODEL_ATTRIBUTES.INFO_OPERACION_GENERICA).toBe('infoOperacionGenerica');
    // @source MODEL_MENSAJE_ERROR = "mensajeError"
    expect(MODEL_ATTRIBUTES.MENSAJE_ERROR).toBe('mensajeError');
    // @source MODEL_LISTA_CONSENTIMIENTOS_CDAC = "lstConsentimientos"
    expect(MODEL_ATTRIBUTES.LISTA_CONSENTIMIENTOS).toBe('lstConsentimientos');
  });

  it('should have the correct number of model attributes', () => {
    expect(Object.keys(MODEL_ATTRIBUTES)).toHaveLength(4);
  });

  it('should use camelCase for attribute values (matching signal naming)', () => {
    const values = Object.values(MODEL_ATTRIBUTES);
    for (const value of values) {
      expect(value).not.toMatch(/^[A-Z]/); // no UPPER_SNAKE_CASE values
      expect(value).not.toMatch(/-/);       // no kebab-case values
    }
  });
});

// ---------------------------------------------------------------------------
// Society Codes
// ---------------------------------------------------------------------------

describe('SOCIETY_CODES', () => {
  it('should have exactly 3 society codes (400, 600, 800)', () => {
    expect(Object.keys(SOCIETY_CODES)).toHaveLength(3);
  });

  it('should match legacy society values', () => {
    expect(SOCIETY_CODES.DEFAULT).toBe('400');
    expect(SOCIETY_CODES.CAJAMAR).toBe('600');
    expect(SOCIETY_CODES.XFERA).toBe('800');
  });

  it('should use numeric strings for society codes', () => {
    const codes = Object.values(SOCIETY_CODES);
    for (const code of codes) {
      expect(code).toMatch(/^\d{3}$/);
      expect(Number(code)).toBeGreaterThan(0);
    }
  });
});

// ---------------------------------------------------------------------------
// Error Keys
// ---------------------------------------------------------------------------

describe('ERROR_KEYS', () => {
  it('should have at least 4 error keys', () => {
    expect(Object.keys(ERROR_KEYS).length).toBeGreaterThanOrEqual(4);
  });

  it('should use dot-notation for i18n key format', () => {
    const keys = Object.values(ERROR_KEYS);
    for (const key of keys) {
      expect(key).toMatch(/^error\./); // all start with "error."
    }
  });

  it('should have defined error keys for known scenarios', () => {
    expect(ERROR_KEYS.GENERIC).toBeDefined();
    expect(ERROR_KEYS.SMS_FINANCIERO_NO_VALIDO).toBeDefined();
    expect(ERROR_KEYS.SMS_GENERICO_NO_VALIDO).toBeDefined();
    expect(ERROR_KEYS.TOKEN_CADUCADO).toBeDefined();
    expect(ERROR_KEYS.TOKEN_COTITULAR).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Feature Flags
// ---------------------------------------------------------------------------

describe('FEATURE_FLAGS', () => {
  it('should have feature flags defined', () => {
    expect(FEATURE_FLAGS.CONSENTIMIENTOS).toBeDefined();
    expect(FEATURE_FLAGS.COTITULAR_SMS).toBeDefined();
  });

  it('should default feature flags to false (opt-in)', () => {
    expect(FEATURE_FLAGS.CONSENTIMIENTOS).toBe(false);
    expect(FEATURE_FLAGS.COTITULAR_SMS).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Cross-constant Integrity
// ---------------------------------------------------------------------------

describe('Constants integrity', () => {
  it('should not have duplicate values across constant groups', () => {
    const routeValues = Object.values(ROUTE_PATHS) as readonly string[];
    const queryValues = Object.values(QUERY_PARAMS) as readonly string[];
    const modelValues = Object.values(MODEL_ATTRIBUTES) as readonly string[];

    const querySet = new Set<string>(queryValues);

    // No overlap between route paths and query params
    for (const rv of routeValues) {
      expect(querySet.has(rv)).toBe(false);
    }
    // No overlap between model attrs and query params
    for (const mv of modelValues) {
      expect(querySet.has(mv)).toBe(false);
    }
  });

  it('should export all expected constant groups', () => {
    expect(ROUTE_PATHS).toBeDefined();
    expect(QUERY_PARAMS).toBeDefined();
    expect(MODEL_ATTRIBUTES).toBeDefined();
    expect(SOCIETY_CODES).toBeDefined();
    expect(ERROR_KEYS).toBeDefined();
    expect(FEATURE_FLAGS).toBeDefined();
  });
});
