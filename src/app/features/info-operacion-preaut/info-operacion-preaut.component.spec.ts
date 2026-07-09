import { describe, it, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { InfoOperacionPreautComponent } from './info-operacion-preaut.component';

describe('InfoOperacionPreautComponent', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({
      imports: [InfoOperacionPreautComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(InfoOperacionPreautComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
