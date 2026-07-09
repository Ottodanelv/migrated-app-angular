import { TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HeaderComponent],
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(HeaderComponent);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the secure zone label', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Zona Segura');
  });
});
