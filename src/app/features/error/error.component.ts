/**
 * Error page component — shown for invalid routes or system errors.
 *
 * This is the Angular equivalent of the legacy error/error.jsp page.
 *
 * @source Legacy:
 *   - ViewConstantes.PAGE_ERROR_GENERICO = "error/error"
 *   - WebXML error-page mappings
 */

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="animate-fade-in text-center py-12">
      <div class="max-w-md mx-auto">
        <h1 class="text-5xl font-bold text-error mb-4">Error</h1>
        <div class="error-block text-left">
          <p class="text-text-secondary text-md">
            Se ha producido un error al procesar su solicitud.
          </p>
          <p class="text-text-muted text-sm mt-2">
            Es posible que el enlace que ha utilizado no sea válido
            o que la operación no se haya podido completar.
          </p>
        </div>
        <div class="mt-8">
          <a
            routerLink="/"
            class="text-brand-primary underline text-sm font-bold"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  `,
})
export class ErrorComponent {}
