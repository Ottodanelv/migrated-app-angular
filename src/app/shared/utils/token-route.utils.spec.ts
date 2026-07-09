import { describe, expect, it } from 'vitest';

import { ROUTE_PATHS } from '../constants/app.constants';
import { resolveRoutePathForTokenType } from './token-route.utils';

describe('resolveRoutePathForTokenType', () => {
  it('should route COMPRA_PLAZO_TARJ to the compra plazos page', () => {
    expect(resolveRoutePathForTokenType('COMPRA_PLAZO_TARJ')).toBe(
      ROUTE_PATHS.INFO_OPERACION_COMPRA_PLAZOS,
    );
  });

  it('should route COMBOCARD to the preaut page', () => {
    expect(resolveRoutePathForTokenType('COMBOCARD')).toBe(
      ROUTE_PATHS.INFO_OPERACION_PREAUT,
    );
  });

  it('should route ALERT_CDAT_COT to the generic operation page', () => {
    expect(resolveRoutePathForTokenType('ALERT_CDAT_COT')).toBe(
      ROUTE_PATHS.INFO_OPERACION_GENERICA,
    );
  });

  it('should fallback to the default financial route for unknown token types', () => {
    expect(resolveRoutePathForTokenType('UNKNOWN_FUTURE_TYPE')).toBe(
      ROUTE_PATHS.INFO_OPERACION,
    );
  });

  it('should fallback to the default financial route when token type is missing', () => {
    expect(resolveRoutePathForTokenType(undefined)).toBe(ROUTE_PATHS.INFO_OPERACION);
    expect(resolveRoutePathForTokenType(null)).toBe(ROUTE_PATHS.INFO_OPERACION);
  });
});
