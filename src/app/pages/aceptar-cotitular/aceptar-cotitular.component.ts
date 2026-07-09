import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, catchError, finalize, of, takeUntil } from 'rxjs';

import { ErrorBannerComponent } from '../../components/error-banner/error-banner.component';
import { LoadingOverlayComponent } from '../../components/loading-overlay/loading-overlay.component';
import { GestionTokenService } from '../../core/services/gestion-token.service';
import { OperacionGenericaStateService } from '../../core/services/operacion-generica-state.service';
import { SmsService } from '../../core/services/sms.service';
import type { OperacionGenerica } from '../../models/operacion-generica';
import { QUERY_PARAMS, ROUTE_PATHS, SOCIETY_CODES } from '../../shared/constants/app.constants';
import { AceptaCesionOkModalComponent } from '../../features/modals/acepta-cesion-ok-modal.component';

@Component({
  selector: 'app-aceptar-cotitular',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    LoadingOverlayComponent,
    ErrorBannerComponent,
    AceptaCesionOkModalComponent,
  ],
  template: `
    <section class="animate-fade-in" data-sociedad="800">
      <app-loading-overlay [visible]="loading()" />

      @if (errorMessage(); as msg) {
        <app-error-banner [message]="msg" />
      }

      @if (operacion(); as op) {
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p class="text-sm font-semibold uppercase tracking-wide text-sky-700">Aceptación de cesión</p>
          <h1 class="mt-2 text-2xl font-bold text-slate-900">Enviar OTP al cotitular</h1>
          <p class="mt-2 text-sm text-slate-600">
            Usaremos el teléfono asociado al token {{ op.token }} para continuar el flujo.
          </p>

          <form [formGroup]="form" class="mt-6 space-y-5" (ngSubmit)="enviarSms()">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700" for="telefono">Teléfono</label>
              <input
                id="telefono"
                type="text"
                formControlName="telefono"
                readonly
                class="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900"
              />
            </div>

            <div class="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
              <p><span class="font-semibold text-slate-900">NIF:</span> {{ op.nif }}</p>
              <p class="mt-1"><span class="font-semibold text-slate-900">Tipo de autenticación:</span> {{ op.tipoAutenticacionFk }}</p>
            </div>

            <div class="flex flex-wrap gap-3">
              <button
                type="submit"
                class="inline-flex items-center rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
                [disabled]="loading() || form.invalid"
              >
                Enviar SMS
              </button>

              <a
                [routerLink]="['/', ROUTE_PATHS.INFO_OPERACION_GENERICA]"
                [queryParams]="{ token: op.token }"
                class="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Volver
              </a>
            </div>
          </form>
        </div>
      }

      <app-acepta-cesion-ok-modal
        [visible]="showSuccessModal()"
        (close)="showSuccessModal.set(false)"
      />
    </section>
  `,
})
export class AceptarCotitularComponent implements OnInit, OnDestroy {
  protected readonly ROUTE_PATHS = ROUTE_PATHS;

  private readonly route = inject(ActivatedRoute);
  private readonly gestionTokenService = inject(GestionTokenService);
  private readonly operacionState = inject(OperacionGenericaStateService);
  private readonly smsService = inject(SmsService);

  protected readonly operacion = signal<OperacionGenerica | null>(null);
  protected readonly loading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly showSuccessModal = signal(false);

  protected readonly form = new FormGroup({
    telefono: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    const operacion = this.operacionState.operacion();

    if (operacion) {
      this.setOperacion(operacion);
      return;
    }

    const token = this.route.snapshot.queryParamMap.get(QUERY_PARAMS.TOKEN);
    if (!token) {
      this.errorMessage.set('No hay datos de operación genérica disponibles para enviar el SMS.');
      return;
    }

    this.loading.set(true);
    this.gestionTokenService
      .utilizarInfoSmsGenerico(token)
      .pipe(
        takeUntil(this.destroy$),
        catchError(() => {
          this.errorMessage.set('No se ha podido recuperar la operación genérica.');
          return of(null);
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((result) => {
        if (!result) {
          return;
        }

        this.operacionState.setOperacion(result);
        this.setOperacion(result);
      });
  }

  protected enviarSms(): void {
    const operacion = this.operacion();
    if (!operacion) {
      this.errorMessage.set('No hay operación disponible para enviar el SMS.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    this.smsService
      .enviarSmsOtp({
        nif: operacion.nif,
        telefono: operacion.telefono,
        sociedad: SOCIETY_CODES.XFERA,
        token: operacion.token,
        aplicacion: operacion.aplicacionFk,
        tipoAutenticacion: operacion.tipoAutenticacionFk,
        codigoNotif: operacion.codigoNotifFk,
      })
      .pipe(
        takeUntil(this.destroy$),
        catchError(() => {
          this.errorMessage.set('No se ha podido enviar el SMS OTP al cotitular.');
          return of(null);
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((enviado) => {
        if (enviado === null) {
          return;
        }

        if (!enviado) {
          this.errorMessage.set('No se ha podido enviar el SMS OTP al cotitular.');
          return;
        }

        this.showSuccessModal.set(true);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setOperacion(operacion: OperacionGenerica): void {
    this.operacion.set(operacion);
    this.form.patchValue({ telefono: operacion.telefono });
  }
}
