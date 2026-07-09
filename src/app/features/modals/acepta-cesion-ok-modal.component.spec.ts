import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { AceptaCesionOkModalComponent } from './acepta-cesion-ok-modal.component';

describe('AceptaCesionOkModalComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AceptaCesionOkModalComponent],
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(AceptaCesionOkModalComponent);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should not render when visible is false', () => {
    const fixture = TestBed.createComponent(AceptaCesionOkModalComponent);
    fixture.componentRef.setInput('visible', false);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[role="dialog"]')).toBeNull();
  });

  it('should render when visible is true', () => {
    const fixture = TestBed.createComponent(AceptaCesionOkModalComponent);
    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[role="dialog"]')).not.toBeNull();
  });

  it('should display the modal title', () => {
    const fixture = TestBed.createComponent(AceptaCesionOkModalComponent);
    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Aceptación de cesión');
  });

  it('should display the success message', () => {
    const fixture = TestBed.createComponent(AceptaCesionOkModalComponent);
    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'La cesión se ha aceptado correctamente'
    );
  });

  it('should have a close button', () => {
    const fixture = TestBed.createComponent(AceptaCesionOkModalComponent);
    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button');
    expect(button).not.toBeNull();
    expect(button?.textContent).toContain('Cerrar');
  });

  it('should emit close event when close button is clicked', () => {
    const fixture = TestBed.createComponent(AceptaCesionOkModalComponent);
    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();

    const closeSpy = vi.spyOn(fixture.componentInstance.close, 'emit');
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button') as HTMLButtonElement;

    button.click();

    expect(closeSpy).toHaveBeenCalledOnce();
  });

  it('should emit close event when backdrop is clicked', () => {
    const fixture = TestBed.createComponent(AceptaCesionOkModalComponent);
    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();

    const closeSpy = vi.spyOn(fixture.componentInstance.close, 'emit');
    const compiled = fixture.nativeElement as HTMLElement;
    const backdrop = compiled.querySelector('[aria-hidden="true"]') as HTMLElement;

    backdrop.click();

    expect(closeSpy).toHaveBeenCalledOnce();
  });

  it('should emit close event when Escape key is pressed', () => {
    const fixture = TestBed.createComponent(AceptaCesionOkModalComponent);
    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();

    const closeSpy = vi.spyOn(fixture.componentInstance.close, 'emit');
    const dialog = fixture.nativeElement.querySelector('[role="dialog"]');
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(closeSpy).toHaveBeenCalledOnce();
  });
});
