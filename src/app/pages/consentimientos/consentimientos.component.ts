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
    <section class="animate-fade-in" data-sociedad="800">
      <app-loading-overlay [visible]="loading()" label="Cargando consentimientos..." />

      @if (errorMessage(); as msg) {
        <app-error-banner [message]="msg" />
      }

      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p class="text-sm font-semibold uppercase tracking-wide text-sky-700">Consentimientos CDAC</p>
        <div class="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 class="text-2xl font-bold text-slate-900">Gestión de consentimientos</h1>
            <p class="mt-2 text-sm text-slate-600">
              Vista migrada desde JSP para consultar el detalle de cada consentimiento asociado al usuario.
            </p>
          </div>

          <div class="grid grid-cols-2 gap-3 text-sm md:min-w-72">
            <div class="rounded-xl bg-slate-50 p-4">
              <p class="font-semibold text-slate-500">Totales</p>
              <p class="mt-2 text-2xl font-bold text-slate-900">{{ consentimientos().length }}</p>
            </div>
            <div class="rounded-xl bg-slate-50 p-4">
              <p class="font-semibold text-slate-500">Aceptados</p>
              <p class="mt-2 text-2xl font-bold text-emerald-700">{{ acceptedCount() }}</p>
            </div>
          </div>
        </div>

        @if (!loading() && consentimientos().length) {
          <ul class="mt-8 space-y-4">
            @for (consentimiento of consentimientos(); track consentimiento.tipoConsentimiento) {
              <li class="rounded-2xl border border-slate-200 p-5 transition hover:border-sky-200 hover:shadow-sm">
                <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div class="space-y-3">
                    <div class="flex flex-wrap items-center gap-3">
                      <h2 class="text-lg font-semibold text-slate-900">{{ consentimiento.tipoConsentimiento }}</h2>
                      <span
                        class="rounded-full px-2.5 py-1 text-xs font-semibold"
                        [class.bg-emerald-100]="consentimiento.aceptado"
                        [class.text-emerald-700]="consentimiento.aceptado"
                        [class.bg-amber-100]="!consentimiento.aceptado"
                        [class.text-amber-700]="!consentimiento.aceptado"
                      >
                        {{ consentimiento.aceptado ? 'Aceptado' : 'Pendiente' }}
                      </span>
                      @if (consentimiento.obligatorio) {
                        <span class="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700">
                          Obligatorio
                        </span>
                      }
                    </div>

                    <p class="text-sm leading-6 text-slate-600">{{ consentimiento.textoLegal }}</p>

                    @if (consentimiento.masInfo && consentimiento.textoInfo) {
                      <p class="text-sm text-slate-500">
                        Incluye información adicional para mostrar en el detalle.
                      </p>
                    }
                  </div>

                  <div class="flex shrink-0 flex-col items-start gap-3 lg:items-end">
                    <p class="text-sm text-slate-500">
                      Notaría:
                      <span class="font-medium text-slate-700">{{ consentimiento.fchNotaria || 'No disponible' }}</span>
                    </p>
                    <button
                      type="button"
                      class="inline-flex items-center rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800"
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
          <div class="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
            No hay consentimientos disponibles en este momento.
          </div>
        }

        <div class="mt-8 flex flex-wrap gap-3">
          <a
            routerLink="/"
            class="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Volver al inicio
          </a>
        </div>
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
