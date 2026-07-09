import { Component, computed, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

import { SOCIETY_CODES, type SocietyCode } from '../../shared/constants/app.constants';
import { localize } from '../../shared/utils/localize.utils';
import { environment } from '../../../environments/environment';

const HEADER_COPY = {
  portalSubtitle: localize`:@@shared.header.portalSubtitle:Portal de gestión de operaciones`,
  secureZone: localize`:@@shared.header.secureZone:Zona Segura`,
  brandCajamar: localize`:@@shared.header.brandCajamar:CM Credit`,
  brandXfera: localize`:@@shared.header.brandXfera:Xfera`,
  brandCetelem: localize`:@@shared.header.brandCetelem:Cetelem`,
} as const;

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
    <header class="bg-white">
      <div
        class="mx-auto flex w-full max-w-[984px] items-center justify-between gap-6 px-4 py-5 sm:px-[30px]"
      >
        <div class="flex min-w-0 items-center gap-4">
          <div
            class="flex h-14 w-14 items-center justify-center rounded-full border border-border-light bg-bg-section font-display text-lg font-black"
            [class.text-brand-primary]="society() === societyCodes.DEFAULT"
            [class.text-brand-teal-dark]="society() === societyCodes.CAJAMAR"
            [class.text-brand-secondary]="society() === societyCodes.XFERA"
            aria-hidden="true"
          >
            {{ logoBadge() }}
          </div>

          <div class="min-w-0">
            <p class="truncate text-2xl font-black text-text-secondary">
              {{ brandName() }}
            </p>
            <p class="text-sm text-text-muted">{{ portalSubtitle }}</p>
          </div>
        </div>

        <div
          class="flex shrink-0 items-center gap-2 rounded-full border border-border-light bg-bg-section px-4 py-2 text-sm font-bold text-text-secondary"
        >
          <fa-icon [icon]="faLock" class="text-brand-primary" />
          <span>{{ secureZoneLabel() }}</span>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  protected readonly societyCodes = SOCIETY_CODES;
  protected readonly faLock = faLock;
  protected readonly portalSubtitle = HEADER_COPY.portalSubtitle;

  readonly society = input<SocietyCode>(environment.society.default);
  readonly secureZoneLabel = input(HEADER_COPY.secureZone);

  protected readonly brandName = computed(() => {
    switch (this.society()) {
      case SOCIETY_CODES.CAJAMAR:
        return HEADER_COPY.brandCajamar;
      case SOCIETY_CODES.XFERA:
        return HEADER_COPY.brandXfera;
      default:
        return HEADER_COPY.brandCetelem;
    }
  });

  protected readonly logoBadge = computed(() => {
    switch (this.society()) {
      case SOCIETY_CODES.CAJAMAR:
        return 'CM';
      case SOCIETY_CODES.XFERA:
        return 'XF';
      default:
        return 'CT';
    }
  });
}
