/**
 * Auth Guard — Route Protection.
 *
 * Functional route guard that checks if the user is authenticated.
 * Replaces legacy Spring Security `intercept-url` rules.
 *
 * ## Legacy Source References
 *
 * - `security-context.xml` (line 20) — `<intercept-url pattern="/**" access="gestionWeb" />`
 *   All URLs require `gestionWeb` role.
 *
 * ## Migration Decisions
 *
 * - Spring Security XML rules → `CanActivateFn` functional guard.
 * - Role-based access (`access="gestionWeb"`) → authentication check.
 * - `access-denied-page` → redirect to error route.
 *
 * @source Legacy: security-context.xml
 */

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Functional route guard that checks if the user is authenticated.
 *
 * If the user is not authenticated, they are redirected to the error page.
 *
 * Usage in routes:
 * ```typescript
 * export const routes: Routes = [
 *   {
 *     path: 'info-operacion',
 *     component: InfoOperacionComponent,
 *     canActivate: [authGuard],
 *   },
 * ];
 * ```
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirect to error page (matches legacy access-denied-page="/error/general.htm")
  return router.createUrlTree(['/error']);
};