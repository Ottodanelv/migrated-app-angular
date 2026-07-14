import { SOCIETY_CODES, type SocietyCode } from '../constants/app.constants';

export interface SocietyTheme {
  readonly code: SocietyCode;
  readonly name: string;
  readonly logoPath: string;
  readonly footerLogoPath: string;
  readonly warningIconPath: string;
  readonly portalLabel: string;
  readonly portalUrl: string;
  readonly copyrightLabel: string;
  readonly footerLinks: readonly { href: string; label: string }[];
}

const LEGAL_LINKS = {
  legal: 'Información legal',
  privacy: 'Protección de datos',
  publicInfo: 'Información pública',
  cookies: 'Política de cookies',
  security: 'Seguridad',
} as const;

const CETELEM_LINKS = [
  { href: 'https://www.cetelem.es/informacion-legal', label: LEGAL_LINKS.legal },
  { href: 'https://www.cetelem.es/proteccion-de-datos', label: LEGAL_LINKS.privacy },
  { href: 'https://www.cetelem.es/informacion-publica', label: LEGAL_LINKS.publicInfo },
  { href: 'https://www.cetelem.es/politica-de-cookies', label: LEGAL_LINKS.cookies },
  { href: 'https://www.cetelem.es/seguridad', label: LEGAL_LINKS.security },
] as const;

const SOCIETY_THEMES: Record<SocietyCode, SocietyTheme> = {
  [SOCIETY_CODES.DEFAULT]: {
    code: SOCIETY_CODES.DEFAULT,
    name: 'Cetelem',
    logoPath: '/images/common/logo.png',
    footerLogoPath: '/images/common/logo.png',
    warningIconPath: '/images/common/ico_advertencia3.png',
    portalLabel: 'Ir a cetelem.es',
    portalUrl: 'https://www.cetelem.es',
    copyrightLabel: '© Banco Cetelem',
    footerLinks: CETELEM_LINKS,
  },
  [SOCIETY_CODES.CETELEM]: {
    code: SOCIETY_CODES.CETELEM,
    name: 'Cetelem',
    logoPath: '/images/common/logo.png',
    footerLogoPath: '/images/common/logo.png',
    warningIconPath: '/images/common/ico_advertencia3.png',
    portalLabel: 'Ir a cetelem.es',
    portalUrl: 'https://www.cetelem.es',
    copyrightLabel: '© Banco Cetelem',
    footerLinks: CETELEM_LINKS,
  },
  [SOCIETY_CODES.CAJAMAR]: {
    code: SOCIETY_CODES.CAJAMAR,
    name: 'CM Credit',
    logoPath: '/images/cajamar/logo.png',
    footerLogoPath: '/images/cajamar/logo.png',
    warningIconPath: '/images/cajamar/ico_advertencia3.png',
    portalLabel: 'Ir a cajamarconsumo.es',
    portalUrl: 'https://www.cajamarconsumo.es',
    copyrightLabel: '© CM Credit',
    footerLinks: [
      { href: 'https://www.cetelem.es/informacion-legal', label: LEGAL_LINKS.legal },
      { href: 'https://www.cetelem.es/proteccion-de-datos', label: LEGAL_LINKS.privacy },
      { href: 'https://www.cetelem.es/seguridad', label: LEGAL_LINKS.security },
    ],
  },
};

export function getSocietyTheme(code: SocietyCode): SocietyTheme {
  return SOCIETY_THEMES[code];
}
