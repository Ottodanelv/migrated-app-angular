import { Component, computed, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

import { type SocietyCode } from '../../shared/constants/app.constants';
import { environment } from '../../../environments/environment';
import { getSocietyTheme } from '../../shared/theme/society-theme';

interface FooterLink {
  readonly href: string;
  readonly label: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
    <footer class="py-6">
      <div class="mx-auto flex w-full max-w-[984px] flex-col gap-4 px-4 sm:px-[30px]">
        <div class="flex justify-center">
          <img
            class="society-footer-logo max-h-10 w-auto max-w-40 object-contain"
            [src]="brand().footerLogoPath"
            [alt]="brand().name"
          />
        </div>
        <nav class="flex flex-wrap justify-center gap-x-6 gap-y-3">
          @for (link of links(); track link.href) {
            <a
              [href]="link.href"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 text-sm text-text-footer transition hover:text-brand-primary"
            >
              <span>{{ link.label }}</span>
              <fa-icon [icon]="faArrowUpRightFromSquare" class="text-xxs" />
            </a>
          }
        </nav>

        <p class="text-center text-xs text-text-muted">
          {{ copyrightLabel() }}
        </p>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  protected readonly faArrowUpRightFromSquare = faArrowUpRightFromSquare;

  readonly society = input<SocietyCode>(environment.society.default);

  protected readonly brand = computed(() => getSocietyTheme(this.society()));
  protected readonly links = computed<readonly FooterLink[]>(() => this.brand().footerLinks);

  protected readonly copyrightLabel = computed(() => this.brand().copyrightLabel);
}
