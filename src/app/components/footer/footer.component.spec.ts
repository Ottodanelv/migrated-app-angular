import { TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FooterComponent],
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(FooterComponent);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render legacy legal links', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Información legal');
    expect(fixture.nativeElement.textContent).toContain('Protección de datos');
  });

  it('should render the society-specific footer branding', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.componentRef.setInput('society', '800');
    fixture.detectChanges();

    const logo = fixture.nativeElement.querySelector('img');
    expect(logo?.getAttribute('src')).toBe('/images/xfera/logo_footer.png');
    expect(fixture.nativeElement.textContent).toContain('© Xfera');
  });
});
