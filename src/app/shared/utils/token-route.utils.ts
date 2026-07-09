import type { TokenType } from '../../models/token-type';
import { ROUTE_PATHS } from '../constants/app.constants';

/**
 * Resolves the Angular route path that matches the legacy ViewsUtils.vistaPorTipoToken() logic.
 */
export function resolveRoutePathForTokenType(tipoToken: TokenType | null | undefined): string {
  switch (tipoToken) {
    case 'COMPRA_PLAZO_TARJ':
      return ROUTE_PATHS.INFO_OPERACION_COMPRA_PLAZOS;
    case 'COMBOCARD':
      return ROUTE_PATHS.INFO_OPERACION_PREAUT;
    case 'ALERT_CDAT_COT':
      return ROUTE_PATHS.INFO_OPERACION_GENERICA;
    default:
      return ROUTE_PATHS.INFO_OPERACION;
  }
}
