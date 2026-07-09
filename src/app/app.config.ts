import {
  ApplicationConfig,
  ErrorHandler,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { cspInterceptor } from './core/interceptors/csp.interceptor';
import { GlobalErrorHandler } from './core/services/error-handler.service';

/**
 * Application configuration providers.
 *
 * Configures HttpClient with functional interceptors (error normalization
 * and CSP/security documentation), Router (with component input binding),
 * and global error listeners for the Angular 22 standalone app.
 *
 * **Interceptor chain order:**
 * 1. `cspInterceptor` — security documentation & future header injection
 * 2. `errorInterceptor` — HTTP error normalization & i18n key mapping
 *
 * The auth interceptor is intentionally excluded — it belongs to Module #9
 * (Route Guards) and will be added there.
 *
 * @see errorInterceptor — normalizes HttpErrorResponse into NormalizedError
 * @see cspInterceptor — documents server vs client security responsibilities
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(
      withInterceptors([cspInterceptor, errorInterceptor]),
    ),
    provideRouter(routes, withComponentInputBinding()),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
};
