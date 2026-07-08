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
  // Routes will be activated as each feature component is migrated.
  // All route paths use kebab-case constants from ROUTE_PATHS (migrated from PathConstantes.java).
  // Using lazy loading via loadComponent for optimal bundle splitting.

  // TODO: Uncomment routes below as features are implemented (modules #11-#18, #26)

  // { path: '',                                     redirectTo: ROUTE_PATHS.INFO_OPERACION, pathMatch: 'full' },
  // { path: ROUTE_PATHS.INFO_OPERACION,            loadComponent: () => import('./pages/info-operacion/info-operacion.component') },
  // { path: ROUTE_PATHS.INFO_OPERACION_GENERICA,   loadComponent: () => import('./pages/info-operacion-generica/info-operacion-generica.component') },
  // { path: ROUTE_PATHS.ENVIAR_OTP_COTITULAR,      loadComponent: () => import('./pages/acepta-cesion/acepta-cesion.component') },
  // { path: ROUTE_PATHS.ACEPTAR_COTITULAR,         loadComponent: () => import('./pages/acepta-cesion/acepta-cesion.component') },
  // { path: ROUTE_PATHS.ERROR,                     loadComponent: () => import('./pages/error/error.component') },
  // { path: '**',                                   redirectTo: ROUTE_PATHS.ERROR },
];
