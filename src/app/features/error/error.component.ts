import { Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { map } from 'rxjs';

import { ErrorBannerComponent } from '../../components/error-banner/error-banner.component';
import { localize } from '../../shared/utils/localize.utils';
import { getSocietyTheme } from '../../shared/theme/society-theme';
import { resolveSocietyCode } from '../../shared/utils/financial-view-content.utils';

const ERROR_PAGE_COPY = {
  home: localize`:@@shared.errorPage.home:Volver al inicio`,
  title404: localize`:@@shared.errorPage.title404:Página no encontrada`,
  title500: localize`:@@shared.errorPage.title500:Incidencia inesperada`,
  titleGeneric: localize`:@@shared.errorPage.titleGeneric:Error`,
  description404: localize`:@@shared.errorPage.description404:La ruta que intenta abrir no existe o ya no está disponible.`,
  description500: localize`:@@shared.errorPage.description500:Se ha producido un error al procesar su solicitud.`,
  descriptionGeneric: localize`:@@shared.errorPage.descriptionGeneric:Es posible que el enlace utilizado no sea válido o que la operación no se haya podido completar.`,
  bannerFallback: localize`:@@shared.errorPage.bannerFallback:Revise el enlace recibido o vuelva a intentarlo más tarde.`,
} as const;

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [RouterLink, FontAwesomeModule, ErrorBannerComponent],
  template: `
    <div class="animate-fade-in py-8">
      <div class="mx-auto flex max-w-2xl flex-col gap-6 text-center">
        <div class="flex justify-center">
           <div class="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 shadow-soft">
             <img class="h-10 w-10 object-contain" [src]="brand().warningIconPath" alt="" />
          </div>
        </div>

        <div>
           <h1 class="text-brand-primary">{{ title() }}</h1>
          <p class="mt-2 text-md text-text-secondary">{{ description() }}</p>
        </div>

        <app-error-banner [message]="bannerMessage()" />

        <div class="mt-2">
          <a
            routerLink="/"
            queryParamsHandling="preserve"
            class="inline-flex items-center gap-2 text-sm font-bold text-brand-primary underline"
          >
            <fa-icon [icon]="faHouse" />
            {{ homeLabel }}
          </a>
        </div>
      </div>
    </div>
  `,
})
export class ErrorComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly faHouse = faHouse;
  protected readonly homeLabel = ERROR_PAGE_COPY.home;
  private readonly societyQuery = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('sociedad'))),
    { initialValue: null },
  );
  protected readonly brand = computed(() =>
    getSocietyTheme(resolveSocietyCode(this.societyQuery())),
  );

  readonly code = input<'404' | '500' | 'generic'>('generic');
  readonly message = input<string | null>(null);

  protected readonly title = computed(() => {
    switch (this.code()) {
      case '404':
        return ERROR_PAGE_COPY.title404;
      case '500':
        return ERROR_PAGE_COPY.title500;
      default:
        return ERROR_PAGE_COPY.titleGeneric;
    }
  });

  protected readonly description = computed(() => {
    switch (this.code()) {
      case '404':
        return ERROR_PAGE_COPY.description404;
      case '500':
        return ERROR_PAGE_COPY.description500;
      default:
        return ERROR_PAGE_COPY.descriptionGeneric;
    }
  });

  protected readonly bannerMessage = computed(
    () => this.message() ?? ERROR_PAGE_COPY.bannerFallback,
  );
}
