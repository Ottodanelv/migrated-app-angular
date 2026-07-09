import { Component, computed, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

import { ERROR_KEYS } from '../../shared/constants/app.constants';
import { localize } from '../../shared/utils/localize.utils';

const ERROR_BANNER_TITLE = localize`:@@shared.errorBanner.title:No hemos podido completar la solicitud`;

const ERROR_MESSAGES: Record<string, string> = {
  [ERROR_KEYS.GENERIC]: localize`:@@shared.errorBanner.generic:Se ha producido un error inesperado.`,
  [ERROR_KEYS.SMS_FINANCIERO_NO_VALIDO]: localize`:@@shared.errorBanner.smsFinancieroNoValido:El token financiero no es válido o ha caducado.`,
  [ERROR_KEYS.SMS_GENERICO_NO_VALIDO]: localize`:@@shared.errorBanner.smsGenericoNoValido:No se ha podido validar el token genérico.`,
  [ERROR_KEYS.TOKEN_CADUCADO]: localize`:@@shared.errorBanner.tokenCaducado:El token ha caducado. Solicite uno nuevo.`,
  [ERROR_KEYS.TOKEN_COTITULAR]: localize`:@@shared.errorBanner.tokenCotitular:No se ha podido completar la operación del cotitular.`,
};

@Component({
  selector: 'app-error-banner',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
    @if (resolvedMessage(); as message) {
      <div
        class="animate-slide-down rounded-sm border border-error/20 bg-red-50 px-4 py-3 text-text-secondary shadow-soft"
        role="alert"
      >
        <div class="flex items-start gap-3">
          <fa-icon [icon]="faCircleExclamation" class="mt-0.5 text-error" />
          <div>
            <p class="font-bold text-error">{{ title }}</p>
            <p class="mt-1 text-sm">{{ message }}</p>
          </div>
        </div>
      </div>
    }
  `,
})
export class ErrorBannerComponent {
  protected readonly faCircleExclamation = faCircleExclamation;
  protected readonly title = ERROR_BANNER_TITLE;

  readonly message = input<string | null>(null);
  readonly errorKey = input<string | null>(null);

  protected readonly resolvedMessage = computed(() => {
    const directMessage = this.message()?.trim();

    if (directMessage) {
      return directMessage;
    }

    const key = this.errorKey();
    return key ? ERROR_MESSAGES[key] ?? ERROR_MESSAGES[ERROR_KEYS.GENERIC] : null;
  });
}
