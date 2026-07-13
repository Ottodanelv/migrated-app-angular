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
        <!-- Header -->
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 class="text-4xl font-bold text-text-strong">Enviar OTP al cotitular</h1>
            <p class="mt-3 text-md text-text-muted">
              Usaremos el teléfono asociado al token para continuar el flujo. La pantalla debe sentirse corta y muy clara.
            </p>
          </div>
          <span class="inline-flex shrink-0 items-center rounded-full bg-brand-800-light px-3 py-1 text-xs font-bold text-brand-secondary">
            Sociedad 800
          </span>
        </div>

        <!-- Phone field card -->
        <div class="mt-6 rounded-[18px] border border-border-light bg-white p-5">
          <p class="text-xs font-bold uppercase tracking-wide text-text-muted">Teléfono</p>
          <p class="mt-2 text-xl font-bold text-text-strong">{{ op.telefono }}</p>
        </div>

        <!-- Support data -->
        <div class="mt-4 rounded-[18px] bg-panel-muted p-5">
          <p class="text-md font-bold text-text-strong">Datos de soporte</p>
          <p class="mt-2 text-md text-text-muted">
            NIF: {{ op.nif }} &nbsp;&middot;&nbsp; Tipo autenticación: {{ op.tipoAutenticacionFk }} &nbsp;&middot;&nbsp; Aplicación: {{ op.aplicacionFk }}
          </p>
        </div>

        <!-- Error/success zone -->
        <div class="mt-4 rounded-[18px] border border-error/20 bg-red-50/50 p-5">
          <p class="text-md font-bold text-error">Zona preparada para error o success</p>
          <p class="mt-2 text-md text-text-muted">
            Este espacio admite un estado inline y un modal de éxito simple sin romper la composición.
          </p>
        </div>

        <!-- Form -->
        <form [formGroup]="form" class="mt-6" (ngSubmit)="enviarSms()">
          <div class="flex flex-wrap gap-3">
            <button
              type="submit"
              class="inline-flex items-center justify-center rounded-[14px] bg-brand-secondary px-6 py-3 text-md font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              [disabled]="loading() || form.invalid"
            >
              Enviar SMS
            </button>

            <a
              [routerLink]="['/', ROUTE_PATHS.INFO_OPERACION_GENERICA]"
              [queryParams]="{ token: op.token }"
              class="inline-flex items-center justify-center rounded-[14px] border border-border-light bg-white px-6 py-3 text-md font-bold text-text-muted transition hover:bg-panel-muted"
            >
              Volver
            </a>
          </div>
        </form>
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
