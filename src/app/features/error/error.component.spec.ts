/**
 * Tests for ErrorComponent.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ErrorComponent } from './error.component';

describe('ErrorComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ErrorComponent],
      providers: [provideRouter([])],
    });
  });

  it('should be created', () => {
    const fixture = TestBed.createComponent(ErrorComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should display the error heading', () => {
    const fixture = TestBed.createComponent(ErrorComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Error');
  });

  it('should show a link back to the home page', () => {
    const fixture = TestBed.createComponent(ErrorComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const link = compiled.querySelector('a');
    expect(link?.textContent).toContain('Volver al inicio');
  });
});
