import { Routes } from '@angular/router';

import { ROUTE_PATHS } from './shared/constants/app.constants';

/**
 * Application route definitions.
 *
 * All route paths reference ROUTE_PATHS constants (migrated from PathConstantes.java).
 * Components are lazy-loaded for optimal bundle splitting.
 *
 * @source Legacy: web.xml servlet-mapping + dispatcher-servlet.xml + PathConstantes.java
 * @see migration-plan.md modules #11-#18, #26
 */
export const routes: Routes = [
  // Default redirect → info-operacion
  {
    path: '',
    redirectTo: ROUTE_PATHS.INFO_OPERACION,
    pathMatch: 'full',
  },

  // InfoOperacion — main financial operation detail page
  {
    path: ROUTE_PATHS.INFO_OPERACION,
    loadComponent: () =>
      import('./features/info-operacion/info-operacion.component').then(
        (m) => m.InfoOperacionComponent,
      ),
  },

  // InfoOperacionCompraPlazos — installment purchase token view
  {
    path: ROUTE_PATHS.INFO_OPERACION_COMPRA_PLAZOS,
    loadComponent: () =>
      import('./features/info-operacion-compra-plazos/info-operacion-compra-plazos.component').then(
        (m) => m.InfoOperacionCompraPlazosComponent,
      ),
  },

  // InfoOperacionPreaut — COMBOCARD pre-authorization token view
  {
    path: ROUTE_PATHS.INFO_OPERACION_PREAUT,
    loadComponent: () =>
      import('./features/info-operacion-preaut/info-operacion-preaut.component').then(
        (m) => m.InfoOperacionPreautComponent,
      ),
  },

  // InfoOperacionGenerica — cotitular consent token view
  {
    path: ROUTE_PATHS.INFO_OPERACION_GENERICA,
    loadComponent: () =>
      import('./features/info-operacion-generica/info-operacion-generica.component').then(
        (m) => m.InfoOperacionGenericaComponent,
      ),
  },

  // AceptarCotitular — SMS OTP confirmation flow for cotitular consent
  {
    path: ROUTE_PATHS.ACEPTAR_COTITULAR,
    loadComponent: () =>
      import('./features/aceptar-cotitular/aceptar-cotitular.component').then(
        (m) => m.AceptarCotitularComponent,
      ),
  },


  // Error page
  {
    path: ROUTE_PATHS.ERROR,
    loadComponent: () =>
      import('./features/error/error.component').then(
        (m) => m.ErrorComponent,
      ),
  },

  // Wildcard → error page (any unrecognized route)
  { path: '**', redirectTo: ROUTE_PATHS.ERROR },
];
