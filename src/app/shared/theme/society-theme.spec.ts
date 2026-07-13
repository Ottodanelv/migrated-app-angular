import { getSocietyTheme } from './society-theme';

describe('society-theme', () => {
  it('maps each society to its legacy asset and portal', () => {
    expect(getSocietyTheme('400')).toMatchObject({
      name: 'Cetelem',
      logoPath: '/images/common/logo.png',
      portalUrl: 'https://www.cetelem.es',
    });
    expect(getSocietyTheme('600')).toMatchObject({
      name: 'CM Credit',
      logoPath: '/images/cajamar/logo.png',
    });
    expect(getSocietyTheme('800')).toMatchObject({
      name: 'Xfera',
      logoPath: '/images/xfera/logo.png',
      footerLogoPath: '/images/xfera/logo_footer.png',
      portalUrl: 'https://www.cajamarconsumo.es',
    });
  });
});
