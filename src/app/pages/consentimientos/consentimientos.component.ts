import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subject, catchError, finalize, of, takeUntil } from 'rxjs';

import { ErrorBannerComponent } from '../../components/error-banner/error-banner.component';
import { LoadingOverlayComponent } from '../../components/loading-overlay/loading-overlay.component';
import { ConsentimientoService } from '../../core/services/consentimiento.service';
import type { Consentimiento } from '../../models/consentimiento';
import { ConsentimientosModalComponent } from '../../features/modals/consentimientos-modal.component';

@Component({
  selector: 'app-consentimientos',
  standalone: true,
  imports: [
    RouterLink,
    LoadingOverlayComponent,
    ErrorBannerComponent,
    ConsentimientosModalComponent,
  ],
  template: `
    <section class="animate-fade-in">
      <app-loading-overlay [visible]="loading()" label="Cargando consentimientos..." />

      @if (errorMessage(); as msg) {
        <app-error-banner [message]="msg" />
      }

      <!-- Header -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 class="text-4xl font-bold text-brand-primary">Gestión de consentimientos</h1>
          <p class="mt-3 text-md text-text-muted">
            Vista de gestión e inspirada en el flujo legal del legacy, pero más ordenada y escaneable.
          </p>
        </div>

        <!-- Stat cards -->
        <div class="grid grid-cols-2 gap-3">
          <div class="rounded-[18px] bg-panel-muted p-4">
            <p class="text-xs font-bold uppercase tracking-wide text-text-muted">Totales</p>
            <p class="mt-2 text-4xl font-bold text-text-strong">{{ consentimientos().length }}</p>
          </div>
          <div class="rounded-[18px] bg-panel-muted p-4">
            <p class="text-xs font-bold uppercase tracking-wide text-text-muted">Aceptados</p>
            <p class="mt-2 text-4xl font-bold text-success-text">{{ acceptedCount() }}</p>
          </div>
        </div>
      </div>

      <!-- Legal rows -->
      @if (!loading() && consentimientos().length) {
        <ul class="mt-8 space-y-4">
          @for (consentimiento of consentimientos(); track consentimiento.tipoConsentimiento) {
            <li class="rounded-[20px] border border-border-light bg-white p-5 transition hover:border-brand-primary/30 hover:shadow-soft">
              <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div class="min-w-0 flex-1 space-y-3">
                  <div class="flex flex-wrap items-center gap-3">
                    <h2 class="text-lg font-bold text-text-strong">{{ consentimiento.tipoConsentimiento }}</h2>
                    <span
                      class="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold"
                      [class.bg-success-bg]="consentimiento.aceptado"
                      [class.text-success-text]="consentimiento.aceptado"
                      [class.bg-pending-bg]="!consentimiento.aceptado"
                      [class.text-pending-text]="!consentimiento.aceptado"
                    >
                      {{ consentimiento.aceptado ? 'Aceptado' : 'Pendiente' }}
                    </span>
                    @if (consentimiento.obligatorio) {
                      <span class="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-error">
                        Obligatorio
                      </span>
                    }
                  </div>

                  <p class="text-md leading-6 text-text-muted">{{ consentimiento.textoLegal }}</p>

                  @if (consentimiento.masInfo && consentimiento.textoInfo) {
                    <p class="text-sm text-text-light">
                      Incluye información adicional para mostrar en el detalle.
                    </p>
                  }
                </div>

                <div class="flex shrink-0 flex-col items-start gap-3 lg:items-end">
                  <p class="text-sm text-text-muted">
                    Notaría:
                    <span class="font-bold text-text-strong">{{ consentimiento.fchNotaria || 'No disponible' }}</span>
                  </p>
                  <button
                    type="button"
                    class="inline-flex items-center justify-center rounded-[14px] bg-brand-secondary px-5 py-2.5 text-md font-bold text-white transition hover:opacity-90"
                    (click)="openConsentimiento(consentimiento)"
                  >
                    Ver detalle
                  </button>
                </div>
              </div>
            </li>
          }
        </ul>
      } @else if (!loading() && !errorMessage()) {
        <div class="mt-8 rounded-2xl border-2 border-dashed border-border-light bg-panel-muted p-8 text-center text-text-muted">
          No hay consentimientos disponibles en este momento.
        </div>
      }

      <!-- Back button -->
      <div class="mt-8">
        <a
          routerLink="/"
          class="inline-flex items-center justify-center rounded-[14px] border border-border-light bg-white px-6 py-3 text-md font-bold text-text-muted transition hover:bg-panel-muted"
        >
          Volver al inicio
        </a>
      </div>

      <app-consentimientos-modal
        [visible]="showModal()"
        [consentimiento]="selectedConsentimiento()"
        (close)="closeModal()"
      />
    </section>
  `,
})
export class ConsentimientosComponent implements OnInit, OnDestroy {
  protected readonly consentimientos = signal<Consentimiento[]>([]);
  protected readonly selectedConsentimiento = signal<Consentimiento | null>(null);
  protected readonly showModal = signal(false);
  protected readonly loading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly acceptedCount = computed(
    () => this.consentimientos().filter((consentimiento) => consentimiento.aceptado).length,
  );

  private readonly consentimientoService = inject(ConsentimientoService);
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.consentimientoService
      .obtenerConsentimientos()
      .pipe(
        takeUntil(this.destroy$),
        catchError(() => {
          this.errorMessage.set('No se ha podido recuperar el listado de consentimientos.');
          return of([] as Consentimiento[]);
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((consentimientos) => {
        this.consentimientos.set(consentimientos);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected openConsentimiento(consentimiento: Consentimiento): void {
    this.selectedConsentimiento.set(consentimiento);
    this.showModal.set(true);
  }

  protected closeModal(): void {
    this.showModal.set(false);
    this.selectedConsentimiento.set(null);
  }
}
