/**
 * InfoOperacionPreaut — COMBOCARD pre-authorization token view.
 *
 * Reads a `token` from query params, calls GestionTokenService
 * to retrieve financial data, and displays pre-authorization specific fields.
 *
 * Key difference from InfoOperacion: this component is specifically
 * for COMBOCARD token type. In the legacy backend, COMBOCARD tokens
 * route to the pre-authorization view via ViewsUtils.vistaPorTipoToken().
 *
 * States:
 *   - Loading: spinner while the HTTP call is in-flight
 *   - Error: error message if token missing / invalid / not found
 *   - Success: pre-authorization operation data table
 *
 * @source Legacy:
 *   - GestionTokenFinancieroController.validarTokenSmsFinanciero()
 *   - JSP view: WEB-INF/views/gestion/gestionToken/infoOperacionPreaut.jsp
 *   - Token routing: ViewsUtils.vistaPorTipoToken() → COMBOCARD
 */

import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, signal, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, finalize, of, Subject, takeUntil } from 'rxjs';

import { LoadingOverlayComponent } from '../../components/loading-overlay/loading-overlay.component';
import { GestionTokenService } from '../../core/services/gestion-token.service';
import { ErrorComponent } from '../error/error.component';
import type { OperacionFinanciera } from '../../models/operacion-financiera';
import { QUERY_PARAMS } from '../../shared/constants/app.constants';
import {
  getFinancialViewContent,
  resolveSocietyCode,
} from '../../shared/utils/financial-view-content.utils';

@Component({
  selector: 'app-info-operacion-preaut',
  standalone: true,
  imports: [RouterLink, LoadingOverlayComponent, ErrorComponent, NgTemplateOutlet],
  template: `
    <div class="animate-fade-in">
      <app-loading-overlay [visible]="loading()" />

      <!-- Error state -->
      @if (errorMessage(); as msg) {
        <app-error [message]="msg" />
      }

      <!-- Success state -->
      @if (operacion(); as op) {
        @if (op.valido) {
          <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 class="text-4xl font-bold text-brand-primary">{{ viewContent().title }}</h1>
              <p class="mt-3 max-w-2xl text-md text-text-muted">
                Operación preautorizada validada. Revisa el importe, las cuotas y la fecha prevista antes de continuar al portal seguro.
              </p>
            </div>
            <span class="inline-flex w-fit rounded-full bg-brand-800-light px-4 py-2 text-xs font-bold uppercase tracking-wide text-brand-secondary">
              COMBOCARD
            </span>
          </div>

          <div class="mt-6 rounded-3xl bg-panel-soft p-6">
            <p class="text-xs font-bold uppercase tracking-wide text-text-muted">Resumen de la operación</p>
            <p class="mt-2 text-md text-text-muted">
              Esta vista mantiene el flujo COMBOCARD del legacy, pero hace escaneable la información financiera principal.
            </p>
          </div>

          <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ng-container *ngTemplateOutlet="field; context: { label: 'Importe autorizado', value: formatAmount(op.importe) + ' EUR' }" />
            <ng-container *ngTemplateOutlet="field; context: { label: 'Plazo', value: op.meses + ' meses' }" />
            <ng-container *ngTemplateOutlet="field; context: { label: 'Mensualidad', value: formatAmount(op.mensualidad) + ' EUR' }" />
            <ng-container *ngTemplateOutlet="field; context: { label: 'Comisión', value: formatAmount(op.comision) + ' EUR' }" />
            <ng-container *ngTemplateOutlet="field; context: { label: 'TIN', value: formatPercent(op.tin) }" />
            <ng-container *ngTemplateOutlet="field; context: { label: 'TAE', value: formatPercent(op.tae) }" />
            <ng-container *ngTemplateOutlet="field; context: { label: 'Próximo recibo', value: formatDate(op.fchProximoRecibo) }" />
            <ng-container *ngTemplateOutlet="field; context: { label: 'Tipo de token', value: op.tipoToken }" />
          </div>

          <div class="mt-6 rounded-2xl border border-border-light bg-panel-muted p-6">
            @for (paragraph of viewContent().paragraphs; track $index) {
              <p
                class="text-sm leading-7 text-text-secondary"
                [class.mt-4]="$index > 0"
                [class.text-xs]="paragraph.small === true"
              >
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

            <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <a
                class="inline-flex min-w-52 items-center justify-center rounded-[14px] bg-brand-primary px-6 py-3 text-md font-bold text-white transition hover:opacity-90"
                [href]="viewContent().ctaHref"
                target="_self"
              >
                {{ viewContent().ctaLabel }}
              </a>
            </div>
          </div>
        } @else {
          <app-error message="El token proporcionado no es válido o ha caducado." />
        }

        @if (op.valido) {
          <div class="text-center mt-6">
            <a routerLink="/" queryParamsHandling="preserve" class="text-brand-primary underline text-sm">
              Volver al inicio
            </a>
          </div>
        }
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
export class InfoOperacionPreautComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly gestionTokenService = inject(GestionTokenService);

  protected readonly operacion = signal<OperacionFinanciera | null>(null);
  protected readonly loading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly society = signal(resolveSocietyCode(null));
  protected readonly viewContent = computed(() =>
    getFinancialViewContent('preaut', this.operacion() ?? EMPTY_OPERACION, this.society()),
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
  tipoToken: 'COMBOCARD',
};
