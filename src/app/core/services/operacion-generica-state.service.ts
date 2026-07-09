import { Injectable, signal } from '@angular/core';

import type { OperacionGenerica } from '../../models/operacion-generica';

@Injectable({
  providedIn: 'root',
})
export class OperacionGenericaStateService {
  readonly operacion = signal<OperacionGenerica | null>(null);

  setOperacion(operacion: OperacionGenerica): void {
    this.operacion.set(operacion);
  }

  clear(): void {
    this.operacion.set(null);
  }
}
