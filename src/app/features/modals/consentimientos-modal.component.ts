import { Component, input, output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';

import type { Consentimiento } from '../../models/consentimiento';

/**
 * Modal Consentimientos — displays consent details in a dialog.
 *
 * Shows consent type, legal text, acceptance status, notary date,
 * mandatory flag, and expandable supplementary info.
 *
 * @source Legacy:
 *   - JSP: views/800/modal/modal_consentimientos.jsp
 *   - JSP: views/800/consentimientos/consentimientos.jsp
 *   - Society 800 (Xfera) only
 */
@Component({
  selector: 'app-consentimientos-modal',
  standalone: true,
  imports: [DatePipe],
  template: `
    @if (visible()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-consentimientos-title"
        (click)="onBackdropClick($event)"
      >
        <div
          class="mx-4 max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white shadow-lg"
          (click)="$event.stopPropagation()"
        >
          <!-- Header -->
          <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2
              id="modal-consentimientos-title"
              class="text-lg font-bold text-gray-900"
            >
              Detalles del Consentimiento
            </h2>
            <button
              type="button"
              class="text-gray-400 hover:text-gray-600"
              aria-label="Cerrar"
              (click)="close.emit()"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          @if (consentimiento(); as c) {
            <div class="px-6 py-4">
              <dl class="space-y-4">
                <!-- Tipo Consentimiento -->
                <div>
                  <dt class="text-sm font-semibold text-gray-500">Tipo de Consentimiento</dt>
                  <dd class="mt-1 text-base text-gray-900">{{ c.tipoConsentimiento }}</dd>
                </div>

                <!-- Estado -->
                <div>
                  <dt class="text-sm font-semibold text-gray-500">Estado</dt>
                  <dd class="mt-1">
                    @if (c.aceptado) {
                      <span class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800">
                        Aceptado
                      </span>
                    } @else {
                      <span class="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-sm font-medium text-red-800">
                        No aceptado
                      </span>
                    }
                  </dd>
                </div>

                <!-- Obligatorio -->
                <div>
                  <dt class="text-sm font-semibold text-gray-500">Obligatorio</dt>
                  <dd class="mt-1 text-base text-gray-900">
                    {{ c.obligatorio ? 'Sí' : 'No' }}
                  </dd>
                </div>

                <!-- Fecha Notaria -->
                <div>
                  <dt class="text-sm font-semibold text-gray-500">Fecha de Notaría</dt>
                  <dd class="mt-1 text-base text-gray-900">
                    {{ c.fchNotaria | date:'dd/MM/yyyy HH:mm' }}
                  </dd>
                </div>

                <!-- Texto Legal -->
                <div>
                  <dt class="text-sm font-semibold text-gray-500">Texto Legal</dt>
                  <dd class="mt-1 text-sm leading-relaxed text-gray-700">
                    {{ c.textoLegal }}
                  </dd>
                </div>

                <!-- Texto Info (expandable) -->
                @if (c.masInfo && c.textoInfo) {
                  <div>
                    <dt class="text-sm font-semibold text-gray-500">Información Adicional</dt>
                    <dd class="mt-1">
                      <button
                        type="button"
                        class="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                        (click)="toggleInfo()"
                      >
                        {{ showInfo() ? 'Ocultar información' : 'Mostrar más información' }}
                      </button>
                      @if (showInfo()) {
                        <p class="mt-2 text-sm leading-relaxed text-gray-700">
                          {{ c.textoInfo }}
                        </p>
                      }
                    </dd>
                  </div>
                }
              </dl>
            </div>
          } @else {
            <div class="px-6 py-8 text-center text-gray-500">
              No hay datos de consentimiento para mostrar.
            </div>
          }

          <!-- Footer -->
          <div class="flex justify-end border-t border-gray-200 px-6 py-4">
            <button
              type="button"
              class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
export class ConsentimientosModalComponent {
  readonly consentimiento = input<Consentimiento | null>(null);
  readonly visible = input(false);
  readonly close = output<void>();

  protected readonly showInfo = signal(false);

  protected toggleInfo(): void {
    this.showInfo.update((v) => !v);
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }
}
