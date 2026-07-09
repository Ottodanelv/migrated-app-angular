import { DOCUMENT } from '@angular/common';
import { Component, effect, inject, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { type SocietyCode } from '../../shared/constants/app.constants';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <div class="flex min-h-screen flex-col bg-bg-page">
      <app-header [society]="society()" />

      <main class="mx-auto flex w-full max-w-[984px] flex-1 flex-col bg-white px-[15px] py-6 shadow-soft">
        <router-outlet />
      </main>

      <app-footer [society]="society()" />
    </div>
  `,
})
export class LayoutComponent {
  private readonly document = inject(DOCUMENT);

  readonly society = input<SocietyCode>(environment.society.default);

  constructor() {
    effect(() => {
      this.document.documentElement.dataset['sociedad'] = this.society();
    });
  }
}
