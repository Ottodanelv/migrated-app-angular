import { DOCUMENT } from '@angular/common';
import { Component, computed, effect, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { RouterOutlet } from '@angular/router';

import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { type SocietyCode } from '../../shared/constants/app.constants';
import { environment } from '../../../environments/environment';
import { resolveSocietyCode } from '../../shared/utils/financial-view-content.utils';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
       <div class="society-shell flex min-h-screen flex-col bg-bg-page">
      <app-header [society]="society()" />

       <main class="society-main mx-auto flex w-full max-w-[984px] flex-1 flex-col bg-white px-[15px] py-6 shadow-soft">
        <router-outlet />
      </main>

      <app-footer [society]="society()" />
    </div>
  `,
})
export class LayoutComponent {
  private readonly document = inject(DOCUMENT);
  private readonly route = inject(ActivatedRoute);

  readonly societyInput = input<SocietyCode>(environment.society.default, {
    alias: 'society',
  });
  private readonly societyQuery = toSignal(
    this.route.queryParamMap.pipe(
      map((params) => params.get('sociedad')),
    ),
    { initialValue: null },
  );

  readonly society = computed(() =>
    resolveSocietyCode(this.societyQuery() ?? this.societyInput()),
  );

  constructor() {
    effect(() => {
      this.document.documentElement.dataset['sociedad'] = this.society();
    });
  }
}
