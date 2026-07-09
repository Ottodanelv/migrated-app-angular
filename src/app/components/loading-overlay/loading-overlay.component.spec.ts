import { TestBed } from '@angular/core/testing';

import { LoadingOverlayComponent } from './loading-overlay.component';

describe('LoadingOverlayComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoadingOverlayComponent],
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(LoadingOverlayComponent);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the loading message when visible', () => {
    const fixture = TestBed.createComponent(LoadingOverlayComponent);
    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Cargando datos de la operación');
  });
});
