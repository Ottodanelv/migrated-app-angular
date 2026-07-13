import { Component, output, input } from '@angular/core';

/**
 * Modal de confirmación de éxito para la aceptación de cesión.
 *
 * Migrated from: views/800/modal/modal_acepta_cesion_ok.jsp
 * Society 800 (xfera) only.
 */
@Component({
  selector: 'app-acepta-cesion-ok-modal',
  standalone: true,
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
        <div class="relative mx-4 w-full max-w-md rounded-[28px] bg-white p-6 shadow-modal">
          <h2
            id="modal-acepta-cesion-ok-title"
            class="mb-4 text-2xl font-bold text-text-strong"
          >
            Aceptación de cesión
          </h2>

          <div class="mb-6">
            <p class="text-md text-text-muted">
              La cesión se ha aceptado correctamente.
            </p>
          </div>

          <div class="flex justify-end">
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
  /** Controla la visibilidad del modal. */
  readonly visible = input(false);

  /** Evento emitido cuando el usuario cierra el modal. */
  readonly close = output<void>();
}
