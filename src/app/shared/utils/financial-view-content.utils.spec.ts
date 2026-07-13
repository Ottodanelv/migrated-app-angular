import { describe, expect, it } from 'vitest';

import type { OperacionFinanciera } from '../../models/operacion-financiera';
import { SOCIETY_CODES } from '../constants/app.constants';
import {
  getFinancialViewContent,
  resolveSocietyCode,
} from './financial-view-content.utils';

const mockOperacion: OperacionFinanciera = {
  token: 'FIN-TOKEN-001',
  importe: 12500,
  mensualidad: 347.22,
  meses: 36,
  impTotalAdeudado: 12000,
  comision: 150,
  fchProximoRecibo: '2026-08-15',
  tin: 4.75,
  tae: 5.12,
  valido: true,
  tipoToken: 'COMBOCARD',
};

describe('financial-view-content utils', () => {
  it('should resolve unsupported society values to the default brand', () => {
    expect(resolveSocietyCode('999')).toBe(SOCIETY_CODES.DEFAULT);
    expect(resolveSocietyCode(null)).toBe(SOCIETY_CODES.DEFAULT);
  });

  it('should produce the legacy-style generic financial copy for default society', () => {
    const content = getFinancialViewContent('base', mockOperacion, SOCIETY_CODES.DEFAULT);

    expect(content.title).toBe('Información');
    expect(content.paragraphs[0]).toContain('Ha realizado una utilización de tarjeta');
    expect(content.paragraphs[1]).toContain('operación pre-autorizada en moneda extranjera');
    expect(content.paragraphs[2]).toContain('Espacio Cliente');
    expect(content.ctaLabel).toBe('Ir a cetelem.es');
  });

  it('should include the operation code and SMS confirmation copy for compra plazos', () => {
    const content = getFinancialViewContent('compra-plazos', mockOperacion, SOCIETY_CODES.DEFAULT);

    expect(content.title).toBe('Datos de la operación');
    expect(content.paragraphs[2]).toContain(mockOperacion.token);
    expect(content.paragraphs[3]).toContain('APLAZA');
  });

  it('should switch the CTA destination for xfera society variants', () => {
    const content = getFinancialViewContent('preaut', mockOperacion, SOCIETY_CODES.XFERA);

    expect(content.paragraphs[0]).toContain('cajamarconsumo.es');
    expect(content.ctaHref).toBe('http://www.cajamarconsumo.es');
    expect(content.ctaLabel).toBe('Ir a cajamarconsumo.es');
  });

  it('should keep the cajamar preaut copy without embedded customer portal link', () => {
    const content = getFinancialViewContent('preaut', mockOperacion, SOCIETY_CODES.CAJAMAR);

    expect(content.paragraphs[0]).not.toContain('href=');
    expect(content.paragraphs[1]).toContain('La fecha del primer recibo podrá desplazarse');
  });
});
