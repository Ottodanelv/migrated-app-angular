import { Component, computed, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

import { SOCIETY_CODES, type SocietyCode } from '../../shared/constants/app.constants';
import { environment } from '../../../environments/environment';

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
        <nav class="flex flex-wrap justify-center gap-x-6 gap-y-3">
          @for (link of links(); track link.href) {
            <a
              [href]="link.href"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 text-sm text-text-footer transition hover:text-brand-teal-dark"
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

  protected readonly links = computed<readonly FooterLink[]>(() => {
    if (this.society() === SOCIETY_CODES.XFERA) {
      return [
        { href: 'https://www.cetelem.es/informacion-legal', label: 'Información legal' },
        { href: 'https://www.cetelem.es/proteccion-de-datos', label: 'Protección de datos' },
        { href: 'https://www.cetelem.es/seguridad', label: 'Seguridad' },
      ] as const;
    }

    return [
      { href: 'https://www.cetelem.es/informacion-legal', label: 'Información legal' },
      { href: 'https://www.cetelem.es/proteccion-de-datos', label: 'Protección de datos' },
      { href: 'https://www.cetelem.es/informacion-publica', label: 'Información pública' },
      { href: 'https://www.cetelem.es/politica-de-cookies', label: 'Política de cookies' },
      { href: 'https://www.cetelem.es/seguridad', label: 'Seguridad' },
    ] as const;
  });

  protected readonly copyrightLabel = computed(() =>
    this.society() === SOCIETY_CODES.XFERA ? '© Xfera' : '© Banco Cetelem',
  );
}
