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

  it('should render the society-specific logo and name', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.componentRef.setInput('society', '800');
    fixture.detectChanges();

    const logo = fixture.nativeElement.querySelector('img');
    expect(logo?.getAttribute('src')).toBe('/images/xfera/logo.png');
    expect(fixture.nativeElement.textContent).toContain('Xfera');
  });
});
