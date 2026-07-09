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

import { DecimalPipe } from '@angular/common';
import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, finalize, of, Subject, takeUntil } from 'rxjs';

import { ErrorBannerComponent } from '../../components/error-banner/error-banner.component';
import { LoadingOverlayComponent } from '../../components/loading-overlay/loading-overlay.component';
import { GestionTokenService } from '../../core/services/gestion-token.service';
import type { OperacionFinanciera } from '../../models/operacion-financiera';
import { QUERY_PARAMS } from '../../shared/constants/app.constants';

@Component({
  selector: 'app-info-operacion',
  standalone: true,
  imports: [RouterLink, DecimalPipe, LoadingOverlayComponent, ErrorBannerComponent],
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
          <h1>Información de la Operación</h1>

          <div class="section-gray rounded-sm p-4 mb-4">
            <h2 class="text-2xl font-bold text-text-secondary mb-4">
              Datos del Préstamo
            </h2>

            <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt class="text-text-muted text-sm font-bold">Token</dt>
                <dd class="text-text-secondary text-md">{{ op.token }}</dd>
              </div>

              <div>
                <dt class="text-text-muted text-sm font-bold">Importe</dt>
                <dd class="text-text-secondary text-md">
                  {{ op.importe | number: '1.2-2' }} €
                </dd>
              </div>

              <div>
                <dt class="text-text-muted text-sm font-bold">Mensualidad</dt>
                <dd class="text-text-secondary text-md">
                  {{ op.mensualidad | number: '1.2-2' }} €
                </dd>
              </div>

              <div>
                <dt class="text-text-muted text-sm font-bold">Meses</dt>
                <dd class="text-text-secondary text-md">{{ op.meses }}</dd>
              </div>

              <div>
                <dt class="text-text-muted text-sm font-bold">
                  Total Adeudado
                </dt>
                <dd class="text-text-secondary text-md">
                  {{ op.impTotalAdeudado | number: '1.2-2' }} €
                </dd>
              </div>

              <div>
                <dt class="text-text-muted text-sm font-bold">Comisión</dt>
                <dd class="text-text-secondary text-md">
                  {{ op.comision | number: '1.2-2' }} €
                </dd>
              </div>

              <div>
                <dt class="text-text-muted text-sm font-bold">TIN</dt>
                <dd class="text-text-secondary text-md">{{ op.tin }} %</dd>
              </div>

              <div>
                <dt class="text-text-muted text-sm font-bold">TAE</dt>
                <dd class="text-text-secondary text-md">{{ op.tae }} %</dd>
              </div>

              <div>
                <dt class="text-text-muted text-sm font-bold">
                  Próximo Recibo
                </dt>
                <dd class="text-text-secondary text-md">
                  {{ op.fchProximoRecibo }}
                </dd>
              </div>

              <div>
                <dt class="text-text-muted text-sm font-bold">
                  Tipo de Token
                </dt>
                <dd class="text-text-secondary text-md">
                  {{ op.tipoToken }}
                </dd>
              </div>
            </dl>
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

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get(QUERY_PARAMS.TOKEN);

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
