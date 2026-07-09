import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, catchError, finalize, forkJoin, of, takeUntil } from 'rxjs';

import { ErrorBannerComponent } from '../../components/error-banner/error-banner.component';
import { LoadingOverlayComponent } from '../../components/loading-overlay/loading-overlay.component';
import { ConsentimientoService } from '../../core/services/consentimiento.service';
import { GestionTokenService } from '../../core/services/gestion-token.service';
import { OperacionGenericaStateService } from '../../core/services/operacion-generica-state.service';
import type { Consentimiento } from '../../models/consentimiento';
import type { OperacionGenerica } from '../../models/operacion-generica';
import { QUERY_PARAMS, ROUTE_PATHS } from '../../shared/constants/app.constants';

@Component({
  selector: 'app-info-operacion-generica',
  standalone: true,
  imports: [RouterLink, LoadingOverlayComponent, ErrorBannerComponent],
  template: `
    <section class="animate-fade-in" data-sociedad="800">
      <app-loading-overlay [visible]="loading()" />

      @if (errorMessage(); as msg) {
        <app-error-banner [message]="msg" />
      }

      @if (operacion(); as op) {
        @if (op.valido) {
          <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p class="text-sm font-semibold uppercase tracking-wide text-sky-700">
              Cesión de datos cotitular
            </p>
            <h1 class="mt-2 text-2xl font-bold text-slate-900">
              Información del token genérico
            </h1>
            <p class="mt-2 text-sm text-slate-600">
              Hemos validado el token y cargado los consentimientos asociados.
            </p>

            <dl class="mt-6 grid gap-4 md:grid-cols-2">
              <div class="rounded-xl bg-slate-50 p-4">
                <dt class="text-xs font-semibold uppercase text-slate-500">Token</dt>
                <dd class="mt-1 text-sm text-slate-900">{{ op.token }}</dd>
              </div>
              <div class="rounded-xl bg-slate-50 p-4">
                <dt class="text-xs font-semibold uppercase text-slate-500">NIF</dt>
                <dd class="mt-1 text-sm text-slate-900">{{ op.nif }}</dd>
              </div>
              <div class="rounded-xl bg-slate-50 p-4">
                <dt class="text-xs font-semibold uppercase text-slate-500">Teléfono</dt>
                <dd class="mt-1 text-sm text-slate-900">{{ op.telefono }}</dd>
              </div>
              <div class="rounded-xl bg-slate-50 p-4">
                <dt class="text-xs font-semibold uppercase text-slate-500">Tipo token</dt>
                <dd class="mt-1 text-sm text-slate-900">{{ op.tipoToken }}</dd>
              </div>
            </dl>

            <div class="mt-8">
              <h2 class="text-lg font-semibold text-slate-900">Consentimientos CDAC</h2>
              <p class="mt-1 text-sm text-slate-600">
                Estos consentimientos se cargan desde el flujo legacy cargarConsentimientosCDAC().
              </p>

              @if (consentimientos().length) {
                <ul class="mt-4 space-y-3">
                  @for (consentimiento of consentimientos(); track consentimiento.tipoConsentimiento) {
                    <li class="rounded-xl border border-slate-200 p-4">
                      <div class="flex items-start justify-between gap-4">
                        <div>
                          <p class="font-medium text-slate-900">{{ consentimiento.tipoConsentimiento }}</p>
                          <p class="mt-1 text-sm text-slate-600">{{ consentimiento.textoLegal }}</p>
                        </div>
                        <span class="rounded-full px-2.5 py-1 text-xs font-semibold"
                          [class.bg-emerald-100]="consentimiento.aceptado"
                          [class.text-emerald-700]="consentimiento.aceptado"
                          [class.bg-amber-100]="!consentimiento.aceptado"
                          [class.text-amber-700]="!consentimiento.aceptado"
                        >
                          {{ consentimiento.aceptado ? 'Aceptado' : 'Pendiente' }}
                        </span>
                      </div>
                    </li>
                  }
                </ul>
              } @else {
                <p class="mt-4 text-sm text-slate-500">No se han recibido consentimientos para este token.</p>
              }
            </div>

            <div class="mt-8 flex flex-wrap gap-3">
              <a
                [routerLink]="['/', ROUTE_PATHS.ACEPTAR_COTITULAR]"
                [queryParams]="{ token: op.token }"
                class="inline-flex items-center rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800"
              >
                Continuar con aceptación
              </a>

              <a
                routerLink="/"
                class="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Volver al inicio
              </a>
            </div>
          </div>
        } @else {
          <app-error-banner message="El token proporcionado no es válido o ha caducado." />
        }
      }
    </section>
  `,
})
export class InfoOperacionGenericaComponent implements OnInit, OnDestroy {
  protected readonly ROUTE_PATHS = ROUTE_PATHS;

  private readonly route = inject(ActivatedRoute);
  private readonly gestionTokenService = inject(GestionTokenService);
  private readonly consentimientoService = inject(ConsentimientoService);
  private readonly operacionState = inject(OperacionGenericaStateService);

  protected readonly operacion = signal<OperacionGenerica | null>(null);
  protected readonly consentimientos = signal<Consentimiento[]>([]);
  protected readonly loading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get(QUERY_PARAMS.TOKEN);

    if (!token) {
      this.loading.set(false);
      this.errorMessage.set('No se ha proporcionado un token genérico.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    forkJoin({
      operacion: this.gestionTokenService.utilizarInfoSmsGenerico(token),
      consentimientos: this.consentimientoService.obtenerConsentimientos(),
    })
      .pipe(
        takeUntil(this.destroy$),
        catchError((error) => {
          this.errorMessage.set(
            error?.status === 404
              ? 'El token genérico proporcionado no es válido o no existe.'
              : 'Se ha producido un error al cargar la operación genérica.',
          );
          return of(null);
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((result) => {
        if (!result) {
          return;
        }

        this.operacion.set(result.operacion);
        this.consentimientos.set(result.consentimientos);
        this.operacionState.setOperacion(result.operacion);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
