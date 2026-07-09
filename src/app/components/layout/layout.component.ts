/**
 * Application shell layout component.
 *
 * Provides the header, main content area (via router-outlet),
 * and footer consistent across all pages.
 *
 * Migrated from the legacy JSP layouts (head.jsp, footer.jsp)
 * used across all views.
 */

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="min-h-screen flex flex-col">
      <!-- Header -->
      <header
        class="bg-white mx-auto w-full max-w-[984px] h-[120px] px-[30px] py-5 flex items-center"
      >
        <div class="flex-1">
          <div
            class="w-[175px] h-full bg-contain bg-no-repeat bg-left"
            role="img"
            aria-label="Logo"
          ></div>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-brand-primary text-sm font-bold no-underline">
            Zona Segura
          </span>
        </div>
      </header>

      <!-- Main Content -->
      <main
        class="mx-auto w-full max-w-[984px] bg-white px-[15px] overflow-hidden flex-1"
      >
        <router-outlet />
      </main>

      <!-- Footer -->
      <footer class="text-center my-5">
        <nav class="flex justify-center gap-10">
          <a
            href="#"
            class="text-text-footer text-xs leading-5 no-underline hover:underline"
          >
            Aviso Legal
          </a>
          <a
            href="#"
            class="text-text-footer text-xs leading-5 no-underline hover:underline"
          >
            Política de Privacidad
          </a>
          <a
            href="#"
            class="text-text-footer text-xs leading-5 no-underline hover:underline"
          >
            Contacto
          </a>
        </nav>
      </footer>
    </div>
  `,
})
export class LayoutComponent {}
