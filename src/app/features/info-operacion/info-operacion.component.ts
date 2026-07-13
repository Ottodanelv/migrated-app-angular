/**
 * InfoOperacion — Financial operation detail page.
 *
 * Reads a `token` from query params, calls GestionTokenService
 * to retrieve financial data, and displays it.
 *
 * States:
 *   - Loading: spinner while the HTTP call is in-flight
 *   - Error: error message if token missing / invalid / not found
 *   - Success: financial operation data table
 *
 * @source Legacy:
 *   - GestionTokenFinancieroController.validarTokenSmsFinanciero()
 *   - JSP view: WEB-INF/views/gestion/gestionToken/infoOperacion.jsp
 */

import { Component, computed, inject, signal, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, finalize, of, Subject, takeUntil } from 'rxjs';

import { ErrorBannerComponent } from '../../components/error-banner/error-banner.component';
import { LoadingOverlayComponent } from '../../components/loading-overlay/loading-overlay.component';
import { GestionTokenService } from '../../core/services/gestion-token.service';
import type { OperacionFinanciera } from '../../models/operacion-financiera';
import { QUERY_PARAMS } from '../../shared/constants/app.constants';
import {
  getFinancialViewContent,
  resolveSocietyCode,
} from '../../shared/utils/financial-view-content.utils';

@Component({
  selector: 'app-info-operacion',
  standalone: true,
  imports: [RouterLink, LoadingOverlayComponent, ErrorBannerComponent],
  template: `
    <div class="animate-fade-in">
      <app-loading-overlay [visible]="loading()" />

      <!-- Error state -->
      @if (errorMessage(); as msg) {
        <app-error-banner [message]="msg" />
        <div class="text-center mt-4">
          <a routerLink="/" class="text-brand-primary underline text-sm">
            Volver al inicio
          </a>
        </div>
      }

      <!-- Success state -->
      @if (operacion(); as op) {
        @if (op.valido) {
          <h1 class="text-3xl font-bold text-text-secondary">{{ viewContent().title }}</h1>

          <div class="mt-6 rounded-2xl border border-border-light bg-bg-section p-6 shadow-soft">
            @for (paragraph of viewContent().paragraphs; track $index) {
              <p
                class="justify text-sm leading-7 text-text-secondary"
                [class.mt-4]="$index > 0"
                [innerHTML]="paragraph"
              ></p>
            }

            <div class="mt-8 flex justify-center">
              <a
                class="inline-flex min-w-52 items-center justify-center rounded-full bg-brand-primary px-6 py-3 text-sm font-bold text-white transition hover:opacity-90"
                [href]="viewContent().ctaHref"
                target="_self"
              >
                {{ viewContent().ctaLabel }}
              </a>
            </div>
          </div>
        } @else {
          <app-error-banner message="El token proporcionado no es válido o ha caducado." />
        }

        <div class="text-center mt-6">
          <a routerLink="/" class="text-brand-primary underline text-sm">
            Volver al inicio
          </a>
        </div>
      }
    </div>
  `,
})
export class InfoOperacionComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly gestionTokenService = inject(GestionTokenService);

  protected readonly operacion = signal<OperacionFinanciera | null>(null);
  protected readonly loading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly society = signal(resolveSocietyCode(null));
  protected readonly viewContent = computed(() =>
    getFinancialViewContent('base', this.operacion() ?? EMPTY_OPERACION, this.society()),
  );

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get(QUERY_PARAMS.TOKEN);
    this.society.set(
      resolveSocietyCode(this.route.snapshot.queryParamMap.get(QUERY_PARAMS.SOCIEDAD)),
    );

    if (!token) {
      this.loading.set(false);
      this.errorMessage.set(
        'No se ha proporcionado un token de operación.',
      );
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    this.gestionTokenService
      .obtenerInfoSmsFinanciero(token)
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          if (err.status === 404) {
            this.errorMessage.set(
              'El token proporcionado no es válido o no existe.',
            );
          } else {
            this.errorMessage.set(
              'Se ha producido un error al consultar los datos de la operación.',
            );
          }
          return of(null);
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((result) => {
        if (result) {
          this.operacion.set(result);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

const EMPTY_OPERACION: OperacionFinanciera = {
  token: '',
  importe: 0,
  mensualidad: 0,
  meses: 0,
  impTotalAdeudado: 0,
  comision: 0,
  fchProximoRecibo: '',
  tin: 0,
  tae: 0,
  valido: false,
  tipoToken: 'COMBOCARD',
};
