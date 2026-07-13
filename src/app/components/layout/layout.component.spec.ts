import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { LayoutComponent } from './layout.component';

describe('LayoutComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LayoutComponent],
      providers: [provideRouter([])],
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(LayoutComponent);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the shared shell', () => {
    const fixture = TestBed.createComponent(LayoutComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Zona Segura');
    expect(fixture.nativeElement.textContent).toContain('Información legal');
  });

  it('should resolve the society from the query string', async () => {
    const fixture = TestBed.createComponent(LayoutComponent);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/?sociedad=800');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Xfera');
    expect(document.documentElement.dataset['sociedad']).toBe('800');
  });
});
