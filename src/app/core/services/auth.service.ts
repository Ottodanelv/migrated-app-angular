/**
 * Authentication Service — User Authentication State.
 *
 * Provides methods for managing user authentication state.
 * Replaces legacy Spring Security authentication manager.
 *
 * ## Legacy Source References
 *
 * - `security-context.xml` (lines 53-53) — `authentication-manager`
 *   with `authenticationEntryPoint` for handling unauthenticated access.
 * - `BitSightFilter` — CSP headers (server-side concern).
 *
 * ## Migration Decisions
 *
 * - Spring Security → JWT-based authentication (assumed backend).
 * - Session state → Signal-based state management.
 * - Authentication check → token validation (simplified for migration).
 *
 * @source Legacy: security-context.xml
 */

import { Injectable, signal } from '@angular/core';

/**
 * Service for managing user authentication state.
 *
 * Usage:
 * ```typescript
 * private readonly authService = inject(AuthService);
 *
 * // Check if user is authenticated
 * if (authService.isAuthenticated()) {
 *   // User is authenticated
 * }
 *
 * // Login (simplified)
 * authService.login(token);
 *
 * // Logout
 * authService.logout();
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /** Signal indicating whether the user is authenticated. */
  readonly isAuthenticated = signal(false);

  /** Signal containing the current user's token. */
  readonly token = signal<string | null>(null);

  /**
   * Sets the authentication state with the provided token.
   *
   * @param token - JWT or authentication token.
   */
  login(token: string): void {
    this.token.set(token);
    this.isAuthenticated.set(true);
  }

  /**
   * Clears the authentication state.
   */
  logout(): void {
    this.token.set(null);
    this.isAuthenticated.set(false);
  }
}