/**
 * Tests for ButtonComponent.
 */

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach } from 'vitest';

import { ButtonComponent } from './button.component';

@Component({
  standalone: true,
  imports: [ButtonComponent],
  template: `<app-button [variant]="variant" [href]="href" [routerLink]="routerLink">{{ label }}</app-button>`,
})
class ButtonHostComponent {
  variant: 'primary' | 'secondary' = 'primary';
  href: string | undefined = undefined;
  routerLink: string | undefined = undefined;
  label = 'Continuar';
}

describe('ButtonComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ButtonHostComponent],
      providers: [provideRouter([])],
    });
  });

  it('should render the projected label', () => {
    const fixture = TestBed.createComponent(ButtonHostComponent);
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('a');

    expect(link?.textContent).toContain('Continuar');
  });

  it('should render an external href link with the primary variant classes by default', () => {
    const fixture = TestBed.createComponent(ButtonHostComponent);
    fixture.componentInstance.href = 'https://cetelem.es';
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;

    expect(link.getAttribute('href')).toBe('https://cetelem.es');
    expect(link.className).toContain('bg-[#337F37]');
  });

  it('should render the secondary variant classes when variant is secondary', () => {
    const fixture = TestBed.createComponent(ButtonHostComponent);
    fixture.componentInstance.variant = 'secondary';
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;

    expect(link.className).toContain('border-border-light');
  });

  it('should navigate via routerLink when routerLink is provided instead of href', () => {
    const fixture = TestBed.createComponent(ButtonHostComponent);
    fixture.componentInstance.routerLink = '/';
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;

    expect(link.getAttribute('href')).toBe('/');
  });

  it('should still render the projected label when routerLink is provided', () => {
    const fixture = TestBed.createComponent(ButtonHostComponent);
    fixture.componentInstance.routerLink = '/';
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;

    expect(link.textContent).toContain('Continuar');
  });
});
