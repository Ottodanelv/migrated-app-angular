import { Routes } from '@angular/router';

import { ROUTE_PATHS } from './shared/constants/app.constants';

/**
 * Application route definitions.
 *
 * All route paths reference ROUTE_PATHS constants (migrated from PathConstantes.java).
 * Components will be added lazily as each feature module is migrated.
 *
 * @source Legacy: web.xml servlet-mapping + dispatcher-servlet.xml + PathConstantes.java
 * @see migration-plan.md modules #11-#18, #26
 */
export const routes: Routes = [
  // Default redirect — the first meaningful route will be added in a future module
  { path: '', redirectTo: ROUTE_PATHS.INFO_OPERACION, pathMatch: 'full' },

  // Placeholder routes — components will be added as each feature module is migrated.
  // Using lazy loading via loadComponent for optimal bundle splitting.

  // { path: ROUTE_PATHS.INFO_OPERACION,            loadComponent: () => import('./pages/info-operacion/info-operacion.component') },
  // { path: ROUTE_PATHS.INFO_OPERACION_GENERICA,   loadComponent: () => import('./pages/info-operacion-generica/info-operacion-generica.component') },
  // { path: ROUTE_PATHS.ENVIAR_OTP_COTITULAR,      loadComponent: () => import('./pages/acepta-cesion/acepta-cesion.component') },
  // { path: ROUTE_PATHS.ACEPTAR_COTITULAR,         loadComponent: () => import('./pages/acepta-cesion/acepta-cesion.component') },
  // { path: ROUTE_PATHS.ERROR,                     loadComponent: () => import('./pages/error/error.component') },

  // Wildcard: any unmatched route → error page
  // { path: '**', redirectTo: ROUTE_PATHS.ERROR },
];
