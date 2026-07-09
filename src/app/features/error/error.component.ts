import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHouse, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

import { ErrorBannerComponent } from '../../components/error-banner/error-banner.component';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [RouterLink, FontAwesomeModule, ErrorBannerComponent],
  template: `
    <div class="animate-fade-in py-8">
      <div class="mx-auto flex max-w-2xl flex-col gap-6 text-center">
        <div class="flex justify-center">
          <div class="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-error shadow-soft">
            <fa-icon [icon]="faTriangleExclamation" class="text-4xl" />
          </div>
        </div>

        <div>
          <h1>{{ title() }}</h1>
          <p class="mt-2 text-md text-text-secondary">{{ description() }}</p>
        </div>

        <app-error-banner [message]="bannerMessage()" />

        <div class="mt-2">
          <a
            routerLink="/"
            class="inline-flex items-center gap-2 text-sm font-bold text-brand-primary underline"
          >
            <fa-icon [icon]="faHouse" />
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  `,
})
export class ErrorComponent {
  protected readonly faHouse = faHouse;
  protected readonly faTriangleExclamation = faTriangleExclamation;

  readonly code = input<'404' | '500' | 'generic'>('generic');
  readonly message = input<string | null>(null);

  protected readonly title = computed(() => {
    switch (this.code()) {
      case '404':
        return 'Página no encontrada';
      case '500':
        return 'Incidencia inesperada';
      default:
        return 'Error';
    }
  });

  protected readonly description = computed(() => {
    switch (this.code()) {
      case '404':
        return 'La ruta que intenta abrir no existe o ya no está disponible.';
      case '500':
        return 'Se ha producido un error al procesar su solicitud.';
      default:
        return 'Es posible que el enlace utilizado no sea válido o que la operación no se haya podido completar.';
    }
  });

  protected readonly bannerMessage = computed(
    () => this.message() ?? 'Revise el enlace recibido o vuelva a intentarlo más tarde.',
  );
}
