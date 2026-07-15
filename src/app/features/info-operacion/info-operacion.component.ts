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
  selector: 'app-info-operacion',
  standalone: true,
  imports: [RouterLink, LoadingOverlayComponent, ErrorComponent],
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
          <!-- Header: title + CTA -->
          <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 class="text-4xl font-bold text-brand-primary">{{ viewContent().title }}</h1>
              <p class="mt-3 text-md text-text-muted">
                Operación validada correctamente. El usuario debe entender de un vistazo el importe, el plazo y el coste total antes de seguir.
              </p>
            </div>
            <a
              class="inline-flex shrink-0 items-center justify-center rounded-[14px] bg-brand-primary px-6 py-3 text-md font-bold text-white transition hover:opacity-90"
              [href]="viewContent().ctaHref"
              target="_self"
            >
              {{ viewContent().ctaLabel }}
            </a>
          </div>

          <!-- Summary banner -->
          <div class="mt-6 rounded-3xl bg-panel-soft p-6">
            <p class="text-xs font-bold uppercase tracking-wide text-text-muted">Resumen de la operación</p>
            <p class="mt-2 text-md text-text-muted">
              El detalle financiero se presenta en tarjetas escaneables para facilitar la lectura rápida.
            </p>
          </div>

          <!-- Field cards grid -->
          <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div class="rounded-[18px] border border-border-light bg-white p-5">
              <p class="text-xs font-bold uppercase tracking-wide text-text-muted">Importe</p>
              <p class="mt-2 text-xl font-bold text-text-strong">{{ formatAmount(op.importe) }} EUR</p>
            </div>
            <div class="rounded-[18px] border border-border-light bg-white p-5">
              <p class="text-xs font-bold uppercase tracking-wide text-text-muted">Plazo</p>
              <p class="mt-2 text-xl font-bold text-text-strong">{{ op.meses }} meses</p>
            </div>
            <div class="rounded-[18px] border border-border-light bg-white p-5">
              <p class="text-xs font-bold uppercase tracking-wide text-text-muted">Mensualidad</p>
              <p class="mt-2 text-xl font-bold text-text-strong">{{ formatAmount(op.mensualidad) }} EUR</p>
            </div>
            <div class="rounded-[18px] border border-border-light bg-white p-5">
              <p class="text-xs font-bold uppercase tracking-wide text-text-muted">Comisión</p>
              <p class="mt-2 text-xl font-bold text-text-strong">{{ formatAmount(op.comision) }} EUR</p>
            </div>
            <div class="rounded-[18px] border border-border-light bg-white p-5">
              <p class="text-xs font-bold uppercase tracking-wide text-text-muted">TIN</p>
              <p class="mt-2 text-xl font-bold text-text-strong">{{ formatPercent(op.tin) }}</p>
            </div>
            <div class="rounded-[18px] border border-border-light bg-white p-5">
              <p class="text-xs font-bold uppercase tracking-wide text-text-muted">TAE</p>
              <p class="mt-2 text-xl font-bold text-text-strong">{{ formatPercent(op.tae) }}</p>
            </div>
            <div class="rounded-[18px] border border-border-light bg-white p-5 sm:col-span-2 lg:col-span-2">
              <p class="text-xs font-bold uppercase tracking-wide text-text-muted">Próximo recibo</p>
              <p class="mt-2 text-xl font-bold text-text-strong">{{ formatDate(op.fchProximoRecibo) }}</p>
            </div>
            <div class="rounded-[18px] border border-border-light bg-white p-5">
              <p class="text-xs font-bold uppercase tracking-wide text-text-muted">Tipo de token</p>
              <p class="mt-2 text-xl font-bold text-text-strong">{{ op.tipoToken }}</p>
            </div>
          </div>

          <!-- Legal text -->
          <div class="mt-6 rounded-2xl border border-border-light bg-panel-muted p-6">
            @for (paragraph of viewContent().paragraphs; track $index) {
              <p class="text-md leading-7 text-text-muted" [class.mt-4]="$index > 0">
                @for (segment of paragraph.segments; track $index) {
                  @if (segment.kind === 'strong') {
                    <strong class="text-text-strong">{{ segment.value }}</strong>
                  } @else if (segment.kind === 'link') {
                    <a [href]="segment.href" class="font-semibold underline">{{ segment.value }}</a>
                  } @else {
                    <span>{{ segment.value }}</span>
                  }
                }
              </p>
            }
          </div>

          <!-- Back button -->
          <div class="mt-6">
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
          <div class="text-center mt-6">
            <a routerLink="/" queryParamsHandling="preserve" class="text-brand-primary underline text-sm">
              Volver al inicio
            </a>
          </div>
        }
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
