/**
 * InfoOperacionCompraPlazos — Installment purchase operation detail page.
 *
 * Reads a `token` from query params, calls GestionTokenService
 * to retrieve financial data, and displays it.
 *
 * Key difference from InfoOperacion: this component is specifically
 * for COMPRA_PLAZO_TARJ token type. In the legacy backend, this token
 * type skips `utilizarTokenSmsFinanciero` (no token consumption).
 *
 * States:
 *   - Loading: spinner while the HTTP call is in-flight
 *   - Error: error message if token missing / invalid / not found
 *   - Success: financial operation data table
 *
 * @source Legacy:
 *   - GestionTokenFinancieroController.validarTokenSmsFinanciero()
 *   - JSP view: WEB-INF/views/gestion/gestionToken/infoOperacionCompraPlazos.jsp
 *   - Token routing: ViewsUtils.vistaPorTipoToken() → COMPRA_PLAZO_TARJ
 */

import { NgTemplateOutlet } from '@angular/common';
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
  selector: 'app-info-operacion-compra-plazos',
  standalone: true,
  imports: [RouterLink, LoadingOverlayComponent, ErrorBannerComponent, NgTemplateOutlet],
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
          <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 class="text-4xl font-bold text-text-strong">{{ viewContent().title }}</h1>
              <p class="mt-3 max-w-2xl text-md text-text-muted">
                Resumen claro de la financiación, inspirado en el contenido secuencial del legacy pero convertido en datos fáciles de consultar.
              </p>
            </div>
            <span class="inline-flex w-fit rounded-full bg-success-bg px-4 py-2 text-xs font-bold uppercase tracking-wide text-success-text">
              Compra a plazos
            </span>
          </div>

          <div class="mt-6 rounded-3xl bg-panel-soft p-6">
            <p class="text-xs font-bold uppercase tracking-wide text-text-muted">Resumen de la operación</p>
            <p class="mt-2 text-md text-text-muted">
              Consulta el importe, la cuota y el coste total antes de dirigirte al portal de tu marca.
            </p>
          </div>

          <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ng-container *ngTemplateOutlet="field; context: { label: 'Importe financiado', value: formatAmount(op.importe) + ' EUR' }" />
            <ng-container *ngTemplateOutlet="field; context: { label: 'Plazo', value: op.meses + ' meses' }" />
            <ng-container *ngTemplateOutlet="field; context: { label: 'Mensualidad', value: formatAmount(op.mensualidad) + ' EUR' }" />
            <ng-container *ngTemplateOutlet="field; context: { label: 'Comisión', value: formatAmount(op.comision) + ' EUR' }" />
            <ng-container *ngTemplateOutlet="field; context: { label: 'Importe total adeudado', value: formatAmount(op.impTotalAdeudado) + ' EUR' }" />
            <ng-container *ngTemplateOutlet="field; context: { label: 'Próximo recibo', value: formatDate(op.fchProximoRecibo) }" />
            <ng-container *ngTemplateOutlet="field; context: { label: 'TIN', value: formatPercent(op.tin) }" />
            <ng-container *ngTemplateOutlet="field; context: { label: 'TAE', value: formatPercent(op.tae) }" />
            <ng-container *ngTemplateOutlet="field; context: { label: 'Token', value: op.token }" />
          </div>

          <div class="mt-6 rounded-2xl border border-border-light bg-panel-muted p-6">
            <p class="text-lg font-bold text-text-strong">¿Qué ocurre ahora?</p>
            <p class="mt-2 max-w-2xl text-md leading-7 text-text-muted">
              Revisa los datos y continúa al portal seguro de tu marca. No se modifica la operación desde esta pantalla.
            </p>
          </div>

          <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              class="inline-flex items-center justify-center rounded-[14px] bg-brand-primary px-6 py-3 text-md font-bold text-white transition hover:opacity-90"
              [href]="viewContent().ctaHref"
              target="_self"
            >
              {{ viewContent().ctaLabel }}
            </a>
            <a routerLink="/" class="inline-flex items-center justify-center rounded-[14px] border border-border-light bg-white px-6 py-3 text-md font-bold text-text-muted transition hover:bg-panel-muted">
              Volver al inicio
            </a>
          </div>

          <div class="sr-only">
            @for (paragraph of viewContent().paragraphs; track $index) {
              <p class="text-sm leading-7 text-text-secondary" [class.mt-4]="$index > 0">
                @for (segment of paragraph.segments; track $index) {
                  @if (segment.kind === 'strong') {
                    <strong>{{ segment.value }}</strong>
                  } @else if (segment.kind === 'link') {
                    <a [href]="segment.href" class="font-semibold underline">{{ segment.value }}</a>
                  } @else {
                    <span>{{ segment.value }}</span>
                  }
                }
              </p>
            }
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

      <ng-template #field let-label="label" let-value="value">
        <div class="rounded-[18px] border border-border-light bg-white p-5">
          <p class="text-xs font-bold uppercase tracking-wide text-text-muted">{{ label }}</p>
          <p class="mt-2 text-xl font-bold text-text-strong">{{ value }}</p>
        </div>
      </ng-template>
    </div>
  `,
})
export class InfoOperacionCompraPlazosComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly gestionTokenService = inject(GestionTokenService);

  protected readonly operacion = signal<OperacionFinanciera | null>(null);
  protected readonly loading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly society = signal(resolveSocietyCode(null));
  protected readonly viewContent = computed(() =>
    getFinancialViewContent('compra-plazos', this.operacion() ?? EMPTY_OPERACION, this.society()),
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

  protected formatAmount(value: number): string {
    return new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  protected formatPercent(value: number): string {
    return `${this.formatAmount(value)} %`;
  }

  protected formatDate(value: string): string {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (match) {
      return `${match[3]}/${match[2]}/${match[1]}`;
    }
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('es-ES').format(date);
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
  tipoToken: 'COMPRA_PLAZO_TARJ',
};
