import { describe, it, expect } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { ConsentimientosModalComponent } from './consentimientos-modal.component';
import type { Consentimiento } from '../../models/consentimiento';

describe('ConsentimientosModalComponent', () => {
  let component: ConsentimientosModalComponent;
  let fixture: ComponentFixture<ConsentimientosModalComponent>;

  const mockConsentimiento: Consentimiento = {
    tipoConsentimiento: 'CDAC',
    textoLegal: 'Consento el tratamiento de mis datos para fines de interconexión.',
    textoInfo: 'Información adicional sobre el consentimiento CDAC.',
    aceptado: true,
    swTextoInfo: true,
    fchNotaria: '2026-07-08T12:00:00Z',
    obligatorio: true,
    masInfo: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsentimientosModalComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsentimientosModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render dialog when visible is false', () => {
    fixture.componentRef.setInput('visible', false);
    fixture.componentRef.setInput('consentimiento', mockConsentimiento);
    fixture.detectChanges();

    const dialog = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(dialog).toBeNull();
  });

  it('should render dialog when visible is true', () => {
    fixture.componentRef.setInput('visible', true);
    fixture.componentRef.setInput('consentimiento', mockConsentimiento);
    fixture.detectChanges();

    const dialog = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(dialog).toBeTruthy();
  });

  it('should display consent type', () => {
    fixture.componentRef.setInput('visible', true);
    fixture.componentRef.setInput('consentimiento', mockConsentimiento);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('CDAC');
  });

  it('should display accepted status badge', () => {
    fixture.componentRef.setInput('visible', true);
    fixture.componentRef.setInput('consentimiento', mockConsentimiento);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Aceptado');
  });

  it('should display not accepted status when not accepted', () => {
    const notAccepted: Consentimiento = { ...mockConsentimiento, aceptado: false };
    fixture.componentRef.setInput('visible', true);
    fixture.componentRef.setInput('consentimiento', notAccepted);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('No aceptado');
  });

  it('should emit close event when close button is clicked', () => {
    fixture.componentRef.setInput('visible', true);
    fixture.componentRef.setInput('consentimiento', mockConsentimiento);
    fixture.detectChanges();

    const closeSpy = vi.spyOn(component.close, 'emit');
    const closeButton = fixture.nativeElement.querySelector('button[aria-label="Cerrar"]');
    closeButton.click();

    expect(closeSpy).toHaveBeenCalledOnce();
  });

  it('should emit close event when footer button is clicked', () => {
    fixture.componentRef.setInput('visible', true);
    fixture.componentRef.setInput('consentimiento', mockConsentimiento);
    fixture.detectChanges();

    const closeSpy = vi.spyOn(component.close, 'emit');
    const footerButton = fixture.nativeElement.querySelector(
      'div:last-child > button',
    ) as HTMLElement;
    footerButton.click();

    expect(closeSpy).toHaveBeenCalledOnce();
  });

  it('should emit close event when backdrop is clicked', () => {
    fixture.componentRef.setInput('visible', true);
    fixture.componentRef.setInput('consentimiento', mockConsentimiento);
    fixture.detectChanges();

    const closeSpy = vi.spyOn(component.close, 'emit');
    const backdrop = fixture.nativeElement.querySelector('[role="dialog"]');
    backdrop.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(closeSpy).toHaveBeenCalledOnce();
  });

  it('should show supplementary info when toggle is clicked', () => {
    fixture.componentRef.setInput('visible', true);
    fixture.componentRef.setInput('consentimiento', mockConsentimiento);
    fixture.detectChanges();

    const toggleButton = fixture.nativeElement.querySelector('button:not([aria-label])');
    toggleButton.click();
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Información adicional sobre el consentimiento CDAC');
  });

  it('should show fallback message when consentimiento is null', () => {
    fixture.componentRef.setInput('visible', true);
    fixture.componentRef.setInput('consentimiento', null);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('No hay datos de consentimiento para mostrar.');
  });
});
