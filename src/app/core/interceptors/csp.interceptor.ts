/**
 * CSP/Security Interceptor -- Documentation & Policy Placeholder.
 *
 * This interceptor is a **documentation-first** functional interceptor that
 * clearly demarcates server-side vs client-side security responsibilities.
 * It currently passes all requests/responses through unmodified, serving as:
 *
 * 1. A **documentation anchor** explaining which legacy security concerns
 *    have been REMOVED, DEFERRED, or are out of scope for the Angular app.
 * 2. A **hook point** for future client-side security headers (e.g.,
 *    request signing, rate-limit tokens) when those modules are implemented.
 *
 * ## Legacy Source References
 *
 * - BitSightFilter.doFilterInternal() (BitSightFilter.java:14-20) -- sets
 *   Content-Security-Policy: object-src 'none' HTTP response header.
 * - WebContentInterceptor (dispatcher-servlet.xml:20-28) -- sets cache
 *   control response headers (cacheSeconds=0, Expires, Cache-Control).
 * @source Legacy: BitSightFilter.java:14-20
 * @source Legacy: dispatcher-servlet.xml:20-28
 *
 * ## REMOVED Concerns
 *
 * ### BitSightFilter CSP Header
 * - BitSightFilter.doFilterInternal() sets
 *   Content-Security-Policy: object-src 'none' as an HTTP **response**
 *   header via HttpServletResponse.setHeader().
 * - **Why REMOVED**: Angular runs in the browser and cannot set HTTP response
 *   headers. CSP enforcement is a **server-side / CDN responsibility**.
 *   The real Content-Security-Policy header must be configured on the
 *   backend (e.g., web server, reverse proxy, CDN edge).
 * - **Client-side fallback**: See index.html <meta> tag (Task 3) which
 *   adds <meta http-equiv="Content-Security-Policy" content="object-src 'none'>
 *   as defense-in-depth. This meta tag is a browser-enforced fallback but
 *   is NOT a substitute for the real HTTP response header.
 * - **Status**: REMOVED from Angular scope.
 *
 * ### WebContentInterceptor Cache Headers
 * - WebContentInterceptor configures cacheSeconds=0,
 *   useExpiresHeader=true, useCacheControlHeader=true,
 *   useCacheControlNoStore=true for all paths (/** /star/star).
 * - **Why REMOVED**: Cache-control is a server-side response header concern.
 *   The Angular app cannot instruct the server to set Cache-Control or
 *   Expires headers on its responses. This must be configured on the
 *   backend/CDN.
 * - **Client-side cache hint**: If needed, the interceptor could add
 *   Cache-Control: no-cache to **request** headers to hint proxies not
 *   to serve cached responses, but this is deferred until a specific
 *   requirement arises.
 * - **Status**: REMOVED from Angular scope.
 *
 * ## DEFERRED Concerns
 *
 * - **Client-side request security headers**: Future modules may require
 *   adding headers such as X-Request-ID (for tracing),
 *   X-CSRF-Token (if the backend requires it), or custom rate-limit
 *   token headers. These are DEFERRED to their respective modules.
 * - **Cache-busting query parameters**: If the HTTP API responses are
 *   cached by intermediate proxies, the interceptor could append a
 *   cache-busting query parameter (_t=timestamp) to GET requests.
 *   DEFERRED until a specific caching issue is identified.
 *
 * @module CspInterceptor
 */

import type { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import type { HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Functional HTTP interceptor that serves as a documentation placeholder
 * for security-related HTTP concerns.
 *
 * Currently a **passthrough interceptor**: receives every request, passes
 * it to next() unchanged, and returns the response stream unmodified.
 *
 * **Design decisions applied:**
 * - [CSP] The <meta> tag in index.html (Task 3) + this interceptor
 *   document the security posture. The actual CSP enforcement is the
 *   backend's responsibility.
 * - [Deferred] No security headers are added at this stage. Future modules
 *   will add headers as needed by modifying this interceptor.
 *
 * @param req - The outgoing HTTP request (passed through unmodified).
 * @param next - The next handler in the interceptor chain.
 * @returns An observable of HTTP events, unmodified.
 */
export function cspInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  // Passthrough -- all requests and responses pass through unmodified.
  // Security headers (CSP, cache-control) are server-side concerns;
  // future client-side security headers will be added here when needed.
  //
  // DEFERRED: Add X-Request-ID tracing header
  // DEFERRED: Add cache-busting query parameter for GET requests
  // DEFERRED: Add X-CSRF-Token if backend requires it
  return next(req);
}
