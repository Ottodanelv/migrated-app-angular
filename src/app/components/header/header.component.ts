import { Component, computed, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

import { type SocietyCode } from '../../shared/constants/app.constants';
import { localize } from '../../shared/utils/localize.utils';
import { environment } from '../../../environments/environment';
import { getSocietyTheme } from '../../shared/theme/society-theme';

const HEADER_COPY = {
  portalSubtitle: localize`:@@shared.header.portalSubtitle:Portal de gestión de operaciones`,
  secureZone: localize`:@@shared.header.secureZone:Zona Segura`,
} as const;

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
    <header class="bg-white">
      <div
        class="society-header-inner mx-auto flex w-full max-w-[984px] items-center justify-between gap-6 px-4 py-5 sm:px-[30px]"
      >
        <div class="flex min-w-0 items-center gap-4">
          <div class="flex h-14 min-w-28 items-center justify-center rounded-xl border border-border-light bg-bg-section px-3 py-2">
            <img
              class="society-logo max-h-10 w-auto max-w-32 object-contain"
              [src]="brand().logoPath"
              [alt]="brand().name"
            />
          </div>

          <div class="min-w-0">
            <p class="truncate text-2xl font-black text-brand-primary">
              {{ brand().name }}
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
  protected readonly faLock = faLock;
  protected readonly portalSubtitle = HEADER_COPY.portalSubtitle;

  readonly society = input<SocietyCode>(environment.society.default);
  readonly secureZoneLabel = input(HEADER_COPY.secureZone);

  protected readonly brand = computed(() => getSocietyTheme(this.society()));
}
