import { Component, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
    @if (visible()) {
      <div class="loading-overlay" [attr.aria-live]="'polite'" [attr.aria-busy]="'true'">
        <div class="flex flex-col items-center gap-4 rounded-lg bg-white/95 px-8 py-6 shadow-soft">
          <fa-icon [icon]="faSpinner" class="animate-spin text-4xl text-brand-secondary" />
          <p class="text-center text-md font-bold text-text-secondary">{{ label() }}</p>
        </div>
      </div>
    }
  `,
})
export class LoadingOverlayComponent {
  protected readonly faSpinner = faSpinner;

  readonly visible = input(false);
  readonly label = input('Cargando datos de la operación...');
}
