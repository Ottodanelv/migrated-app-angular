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
        class="fixed inset-0 z-50 flex items-center justify-center bg-overlay-dark"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-consentimientos-title"
        (click)="onBackdropClick($event)"
      >
        <div
          class="mx-4 max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-[28px] bg-white shadow-modal"
          (click)="$event.stopPropagation()"
        >
          <!-- Header -->
          <div class="flex items-center justify-between border-b border-border-light px-6 py-5">
            <div class="flex items-center gap-3">
              <h2
                id="modal-consentimientos-title"
                class="text-2xl font-bold text-text-strong"
              >
                Detalle legal
              </h2>
              @if (consentimiento(); as c) {
                <span
                  class="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold"
                  [class.bg-success-bg]="c.aceptado"
                  [class.text-success-text]="c.aceptado"
                  [class.bg-pending-bg]="!c.aceptado"
                  [class.text-pending-text]="!c.aceptado"
                >
                  {{ c.aceptado ? 'Aceptado' : 'Pendiente' }}
                </span>
              }
            </div>
            <button
              type="button"
              class="text-text-muted hover:text-text-strong"
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
            <div class="px-6 py-5">
              <p class="text-md text-text-muted">
                Modal centrado, legal y accionable. El texto tiene más peso que el decorado y debe respirarse bien.
              </p>

              <dl class="mt-5 space-y-5">
                <!-- Tipo -->
                <div>
                  <dt class="text-xs font-bold uppercase tracking-wide text-text-muted">Tipo</dt>
                  <dd class="mt-1 text-lg font-bold text-text-strong">{{ c.tipoConsentimiento }}</dd>
                </div>

                <!-- Texto Legal -->
                <div>
                  <dt class="text-xs font-bold uppercase tracking-wide text-text-muted">Texto legal</dt>
                  <dd class="mt-1 text-md leading-relaxed text-text-muted">
                    {{ c.textoLegal }}
                  </dd>
                </div>

                <!-- Estado -->
                <div>
                  <dt class="text-xs font-bold uppercase tracking-wide text-text-muted">Estado</dt>
                  <dd class="mt-1">
                    @if (c.aceptado) {
                      <span class="inline-flex items-center rounded-full bg-success-bg px-3 py-1 text-xs font-bold text-success-text">
                        Aceptado
                      </span>
                    } @else {
                      <span class="inline-flex items-center rounded-full bg-pending-bg px-3 py-1 text-xs font-bold text-pending-text">
                        No aceptado
                      </span>
                    }
                  </dd>
                </div>

                <!-- Obligatorio -->
                <div>
                  <dt class="text-xs font-bold uppercase tracking-wide text-text-muted">Obligatorio</dt>
                  <dd class="mt-1 text-md text-text-strong">
                    {{ c.obligatorio ? 'Sí' : 'No' }}
                  </dd>
                </div>

                <!-- Fecha Notaria -->
                <div>
                  <dt class="text-xs font-bold uppercase tracking-wide text-text-muted">Fecha de notaría</dt>
                  <dd class="mt-1 text-md text-text-strong">
                    {{ c.fchNotaria | date:'dd/MM/yyyy HH:mm' }}
                  </dd>
                </div>

                <!-- Info adicional -->
                @if (c.masInfo && c.textoInfo) {
                  <div>
                    <dt class="text-xs font-bold uppercase tracking-wide text-text-muted">Información adicional</dt>
                    <dd class="mt-1">
                      <button
                        type="button"
                        class="text-md font-bold text-brand-teal-dark underline hover:text-brand-teal-light"
                        (click)="toggleInfo()"
                      >
                        {{ showInfo() ? 'Ocultar información' : 'Mostrar más información' }}
                      </button>
                      @if (showInfo()) {
                        <p class="mt-2 text-md leading-relaxed text-text-muted">
                          {{ c.textoInfo }}
                        </p>
                      }
                    </dd>
                  </div>
                }
              </dl>
            </div>
          } @else {
            <div class="px-6 py-8 text-center text-text-muted">
              No hay datos de consentimiento para mostrar.
            </div>
          }

          <!-- Footer -->
          <div class="flex justify-end gap-3 border-t border-border-light px-6 py-5">
            <button
              type="button"
              class="rounded-[14px] bg-brand-secondary px-5 py-2.5 text-md font-bold text-white transition hover:opacity-90"
              (click)="close.emit()"
            >
              Aceptar
            </button>
            <button
              type="button"
              class="rounded-[14px] border border-border-light bg-white px-5 py-2.5 text-md font-bold text-text-muted transition hover:bg-panel-muted"
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
