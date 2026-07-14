import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { GestionTokenService } from '../services/gestion-token.service';
import { QUERY_PARAMS, ROUTE_PATHS } from '../../shared/constants/app.constants';
import { resolveRoutePathForTokenType } from '../../shared/utils/token-route.utils';

/**
 * Redirects the legacy entry route to the Angular page that matches the token type.
 *
 * Mirrors `ViewsUtils.vistaPorTipoToken()` from the legacy application.
 */
export const tokenTypeRouteGuard: CanActivateFn = (route) => {
  const token = route.queryParamMap.get(QUERY_PARAMS.TOKEN);

  if (!token) {
    return true;
  }

  const gestionTokenService = inject(GestionTokenService);
  const router = inject(Router);

  return gestionTokenService.obtenerInfoSmsFinanciero(token).pipe(
    map((operacion) => {
      if (!operacion?.valido) {
        return true;
      }

      const targetPath = resolveRoutePathForTokenType(operacion.tipoToken);

      if (targetPath === ROUTE_PATHS.INFO_OPERACION) {
        return true;
      }

      const society = route.queryParamMap.get(QUERY_PARAMS.SOCIEDAD);
      const queryParams = society
        ? { [QUERY_PARAMS.TOKEN]: token, [QUERY_PARAMS.SOCIEDAD]: society }
        : { [QUERY_PARAMS.TOKEN]: token };

      return router.createUrlTree(['/', targetPath], { queryParams });
    }),
    catchError(() => of(true)),
  );
};
