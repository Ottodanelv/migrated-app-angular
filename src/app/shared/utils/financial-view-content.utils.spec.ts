import { describe, expect, it } from 'vitest';

import type { OperacionFinanciera } from '../../models/operacion-financiera';
import { SOCIETY_CODES } from '../constants/app.constants';
import {
  getFinancialViewContent,
  resolveSocietyCode,
} from './financial-view-content.utils';

function paragraphText(content: ReturnType<typeof getFinancialViewContent>, index: number): string {
  return content.paragraphs[index].segments.map((segment) => segment.value).join('');
}

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
    expect(paragraphText(content, 0)).toContain('Ha realizado una utilización de tarjeta');
    expect(paragraphText(content, 1)).toContain('operación pre-autorizada en moneda extranjera');
    expect(paragraphText(content, 2)).toContain('Espacio Cliente');
    expect(content.ctaLabel).toBe('Ir a cetelem.es');
  });

  it('should include the operation code and SMS confirmation copy for compra plazos', () => {
    const content = getFinancialViewContent('compra-plazos', mockOperacion, SOCIETY_CODES.DEFAULT);

    expect(content.title).toBe('Datos de la operación');
    expect(paragraphText(content, 2)).toContain(mockOperacion.token);
    expect(paragraphText(content, 3)).toContain('APLAZA');
  });

  it('should switch the CTA destination for the legacy 800 society', () => {
    const content = getFinancialViewContent('preaut', mockOperacion, SOCIETY_CODES.CAJAMAR);

    expect(paragraphText(content, 0)).not.toContain('cajamarconsumo.es');
    expect(content.ctaHref).toBe('https://www.cajamarconsumo.es');
    expect(content.ctaLabel).toBe('Ir a cajamarconsumo.es');
  });

  it('should keep the cajamar preaut copy without embedded customer portal link', () => {
    const content = getFinancialViewContent('preaut', mockOperacion, SOCIETY_CODES.CAJAMAR);

    expect(paragraphText(content, 0)).not.toContain('href=');
    expect(paragraphText(content, 1)).toContain('La fecha del primer recibo podrá desplazarse');
  });
});
