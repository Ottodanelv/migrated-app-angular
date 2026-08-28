/**
 * AppButton — reusable CTA/secondary action button.
 *
 * Renders as an `<a>` so it can either navigate within the app
 * (`routerLink`) or link out to an external portal (`href`).
 * Centralizes the button styles previously duplicated across
 * InfoOperacion, InfoOperacionPreaut and InfoOperacionCompraPlazos.
 */

import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink, type QueryParamsHandling } from '@angular/router';

export type ButtonVariant = 'primary' | 'secondary';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'inline-flex shrink-0 items-center justify-center rounded-full bg-[#337F37] px-6 py-3 text-md font-bold text-white shadow-soft transition hover:bg-[#2E7232]',
  secondary:
    'inline-flex items-center justify-center rounded-[14px] border border-border-light bg-white px-6 py-3 text-md font-bold text-text-muted transition hover:bg-panel-muted',
};

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [RouterLink, NgTemplateOutlet],
  template: `
    <ng-template #label><ng-content /></ng-template>

    @if (routerLink(); as link) {
      <a [routerLink]="link" [queryParamsHandling]="queryParamsHandling()" [class]="classes()">
        <ng-container [ngTemplateOutlet]="label" />
      </a>
    } @else {
      <a [href]="href()" [target]="target()" [class]="classes()">
        <ng-container [ngTemplateOutlet]="label" />
      </a>
    }
  `,
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly href = input<string | undefined>(undefined);
  readonly routerLink = input<string | undefined>(undefined);
  readonly queryParamsHandling = input<QueryParamsHandling | undefined>(undefined);
  readonly target = input<string | undefined>(undefined);

  protected readonly classes = computed(() => VARIANT_CLASSES[this.variant()]);
}
