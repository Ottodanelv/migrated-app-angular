import { TestBed } from '@angular/core/testing';

import { ERROR_KEYS } from '../../shared/constants/app.constants';
import { ErrorBannerComponent } from './error-banner.component';

describe('ErrorBannerComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ErrorBannerComponent],
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ErrorBannerComponent);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should resolve a legacy error key into a visible message', () => {
    const fixture = TestBed.createComponent(ErrorBannerComponent);
    fixture.componentRef.setInput('errorKey', ERROR_KEYS.TOKEN_CADUCADO);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('El token ha caducado');
  });
});
