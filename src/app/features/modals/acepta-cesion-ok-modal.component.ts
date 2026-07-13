import { Component, input, output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

/**
 * Modal de confirmación de éxito para la aceptación de cesión.
 *
 * Migrated from: views/800/modal/modal_acepta_cesion_ok.jsp
 * Society 800 (xfera) only.
 */
@Component({
  selector: 'app-acepta-cesion-ok-modal',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
    @if (visible()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-acepta-cesion-ok-title"
        (keydown.escape)="close.emit()"
      >
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-overlay-dark"
          (click)="close.emit()"
          aria-hidden="true"
        ></div>

        <!-- Modal content -->
        <div class="relative mx-4 w-full max-w-md rounded-[28px] bg-white p-6 shadow-modal sm:p-8">
          <button
            type="button"
            aria-label="Cerrar"
            class="absolute right-5 top-5 text-xl text-text-muted transition hover:text-text-strong"
            (click)="close.emit()"
          >
            <span aria-hidden="true">×</span>
            <span class="sr-only">Cerrar</span>
          </button>

          <div class="flex h-14 w-14 items-center justify-center rounded-full bg-success-bg text-success-text">
            <fa-icon [icon]="faCheck" class="text-2xl" />
          </div>
           <h2 id="modal-acepta-cesion-ok-title" class="mt-5 text-2xl font-bold text-brand-primary">
            Aceptación de cesión
          </h2>
          <p class="mt-3 text-md leading-7 text-text-muted">
            <span>La cesión se ha aceptado correctamente.</span>
            <span class="mt-2 block">Ya puede continuar con la operación.</span>
          </p>

          <div class="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              class="rounded-[14px] bg-brand-secondary px-5 py-2.5 text-md font-bold text-white transition hover:opacity-90"
              (click)="close.emit()"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class AceptaCesionOkModalComponent {
  protected readonly faCheck = faCheck;
  /** Controla la visibilidad del modal. */
  readonly visible = input(false);

  /** Evento emitido cuando el usuario cierra el modal. */
  readonly close = output<void>();
}
