import { describe, it, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { InfoOperacionCompraPlazosComponent } from './info-operacion-compra-plazos.component';

describe('InfoOperacionCompraPlazosComponent', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({
      imports: [InfoOperacionCompraPlazosComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(InfoOperacionCompraPlazosComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
