import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, catchError, finalize, forkJoin, of, takeUntil } from 'rxjs';

import { LoadingOverlayComponent } from '../../components/loading-overlay/loading-overlay.component';
import { ErrorComponent } from '../../features/error/error.component';
import { ConsentimientoService } from '../../core/services/consentimiento.service';
import { GestionTokenService } from '../../core/services/gestion-token.service';
import { OperacionGenericaStateService } from '../../core/services/operacion-generica-state.service';
import type { Consentimiento } from '../../models/consentimiento';
import type { OperacionGenerica } from '../../models/operacion-generica';
import { QUERY_PARAMS, ROUTE_PATHS } from '../../shared/constants/app.constants';

@Component({
  selector: 'app-info-operacion-generica',
  standalone: true,
  imports: [RouterLink, LoadingOverlayComponent, ErrorComponent],
  template: `
    <section class="animate-fade-in">
      <app-loading-overlay [visible]="loading()" />

      @if (errorMessage(); as msg) {
        <app-error [message]="msg" />
      }

      @if (operacion(); as op) {
        @if (op.valido) {
          <!-- Header -->
          <p class="text-sm font-bold uppercase tracking-wide text-brand-secondary">
            Cesión de datos cotitular
          </p>
          <h1 class="mt-2 text-4xl font-bold text-brand-primary">
            Información del token genérico
          </h1>
          <p class="mt-3 text-md text-text-muted">
            Hemos validado el token y cargado los consentimientos asociados. El usuario necesita contexto, no ruido visual.
          </p>

          <!-- Field cards -->
          <div class="mt-6 grid gap-4 sm:grid-cols-3">
            <div class="rounded-[18px] border border-border-light bg-white p-5">
              <p class="text-xs font-bold uppercase tracking-wide text-text-muted">Token</p>
              <p class="mt-2 text-xl font-bold text-text-strong">{{ op.token }}</p>
            </div>
            <div class="rounded-[18px] border border-border-light bg-white p-5">
              <p class="text-xs font-bold uppercase tracking-wide text-text-muted">NIF</p>
              <p class="mt-2 text-xl font-bold text-text-strong">{{ op.nif }}</p>
            </div>
            <div class="rounded-[18px] border border-border-light bg-white p-5">
              <p class="text-xs font-bold uppercase tracking-wide text-text-muted">Teléfono</p>
              <p class="mt-2 text-xl font-bold text-text-strong">{{ op.telefono }}</p>
            </div>
          </div>

          <!-- Consentimientos section -->
          <div class="mt-8">
            <h2 class="text-2xl font-bold text-text-strong">Consentimientos CDAC</h2>
            <p class="mt-2 text-md text-text-muted">
              El texto legal sigue mandando. Los badges solo ayudan a leer estados.
            </p>

            @if (consentimientos().length) {
              <ul class="mt-4 space-y-4">
                @for (consentimiento of consentimientos(); track consentimiento.tipoConsentimiento) {
                  <li class="rounded-[20px] border border-border-light bg-white p-5">
                    <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div class="min-w-0 flex-1">
                        <p class="text-lg font-bold text-text-strong">{{ consentimiento.tipoConsentimiento }}</p>
                        <p class="mt-2 text-md text-text-muted">{{ consentimiento.textoLegal }}</p>
                      </div>
                      <span
                        class="inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-bold"
                        [class.bg-success-bg]="consentimiento.aceptado"
                        [class.text-success-text]="consentimiento.aceptado"
                        [class.bg-pending-bg]="!consentimiento.aceptado"
                        [class.text-pending-text]="!consentimiento.aceptado"
                      >
                        {{ consentimiento.aceptado ? 'Aceptado' : 'Pendiente' }}
                      </span>
                    </div>
                  </li>
                }
              </ul>
            } @else {
              <p class="mt-4 text-md text-text-muted">No se han recibido consentimientos para este token.</p>
            }
          </div>

          <!-- Actions -->
          <div class="mt-8 flex flex-wrap gap-3">
            <a
              [routerLink]="['/', ROUTE_PATHS.ACEPTAR_COTITULAR]"
              [queryParams]="{ token: op.token }"
              queryParamsHandling="merge"
              class="inline-flex items-center justify-center rounded-[14px] bg-brand-secondary px-6 py-3 text-md font-bold text-white transition hover:opacity-90"
            >
              Continuar con aceptación
            </a>

            <a
              routerLink="/"
              queryParamsHandling="preserve"
              class="inline-flex items-center justify-center rounded-[14px] border border-border-light bg-white px-6 py-3 text-md font-bold text-text-muted transition hover:bg-panel-muted"
            >
              Volver al inicio
            </a>
          </div>
        } @else {
          <app-error message="El token proporcionado no es válido o ha caducado." />
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
