import type { OperacionFinanciera } from '../../models/operacion-financiera';
import { SOCIETY_CODES, type SocietyCode } from '../constants/app.constants';

export type FinancialViewVariant = 'base' | 'compra-plazos' | 'preaut';

export interface FinancialTextSegment {
  readonly kind: 'text' | 'strong' | 'link';
  readonly value: string;
  readonly href?: string;
}

export interface FinancialParagraph {
  readonly segments: readonly FinancialTextSegment[];
  readonly small?: boolean;
}

export interface FinancialViewContent {
  readonly title: string;
  readonly paragraphs: readonly FinancialParagraph[];
  readonly ctaLabel: string;
  readonly ctaHref: string;
}

const CTA_BY_SOCIETY: Record<SocietyCode, { label: string; href: string }> = {
  [SOCIETY_CODES.DEFAULT]: {
    label: 'Ir a cetelem.es',
    href: 'https://www.cetelem.es',
  },
  [SOCIETY_CODES.CAJAMAR]: {
    label: 'Ir a cetelem.es',
    href: 'https://www.cetelem.es',
  },
  [SOCIETY_CODES.XFERA]: {
    label: 'Ir a cajamarconsumo.es',
    href: 'https://www.cajamarconsumo.es',
  },
};

function formatAmount(value: number): string {
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value: number): string {
  return `${formatAmount(value)}%`;
}

function formatDate(value: string): string {
  const isoDateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (isoDateMatch) {
    const [, year, month, day] = isoDateMatch;
    return `${day}/${month}/${year}`;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('es-ES').format(date);
}

function text(value: string): FinancialTextSegment {
  return { kind: 'text', value };
}

function strong(value: string): FinancialTextSegment {
  return { kind: 'strong', value };
}

function link(value: string, href: string): FinancialTextSegment {
  return { kind: 'link', value, href };
}

function paragraph(
  ...segments: readonly FinancialTextSegment[]
): FinancialParagraph {
  return { segments };
}

function smallParagraph(
  ...segments: readonly FinancialTextSegment[]
): FinancialParagraph {
  return { segments, small: true };
}

function getBaseParagraphs(operacion: OperacionFinanciera, society: SocietyCode): readonly FinancialParagraph[] {
  const importe = formatAmount(operacion.importe);
  const mensualidad = formatAmount(operacion.mensualidad);
  const comision = formatAmount(operacion.comision);
  const tin = formatPercent(operacion.tin);
  const tae = formatPercent(operacion.tae);
  const fecha = formatDate(operacion.fchProximoRecibo);
  const cta = CTA_BY_SOCIETY[society];

  switch (society) {
    case SOCIETY_CODES.XFERA:
      return [
        paragraph(
          text(`Ha realizado una utilización de su Línea de crédito por ${importe} € en modo de pago aplazado, a devolver en ${operacion.meses} cuotas mensuales de ${mensualidad} € cada una. Se ha aplicado una comisión de formalización de ${comision} € financiada junto al principal. TIN ${tin}, TAE ${tae}. El importe total adeudado se corresponde con la suma de las mensualidades. El próximo ${fecha} se le cobrará su primer recibo.`),
        ),
        paragraph(text('Cualquier duda que le surja puede consultarla a través del teléfono de atención al cliente 91 048 30 30.')),
      ];
    case SOCIETY_CODES.CAJAMAR:
      return [
        paragraph(
          text(`Ha realizado una utilización de tarjeta por ${importe} € en modo de pago aplazado. A devolver en ${operacion.meses} cuotas mensuales de ${mensualidad} €. Se aplica una comisión de formalización de ${comision} €, a pagar junto con la primera mensualidad. TIN ${tin}, TAE ${tae}. El importe de la última cuota podrá diferir del resto en función del día en que se haga efectiva la financiación. El importe total adeudado se corresponde con la suma de las mensualidades. El próximo ${fecha} se le cobrará su primer recibo.`),
        ),
        paragraph(text('En el caso de operación pre-autorizada en moneda extranjera, la aplicación del cambio de divisa podría hacer variar el importe final de sus cuotas.')),
        paragraph(text('Consulte el plan de pagos de su utilización a través de la App '), strong('MoneyGO'), text(', donde podrá ver la cantidad exacta de cada una de las cuotas.')),
      ];
    default:
      return [
        paragraph(
          text(`Ha realizado una utilización de tarjeta por ${importe} € en modo de pago aplazado. A devolver en ${operacion.meses} cuotas mensuales de ${mensualidad} €. Se aplica una comisión de formalización de ${comision} €, a pagar junto con la primera mensualidad. TIN ${tin}, TAE ${tae}. El importe de la última cuota podrá diferir del resto en función del día en que se haga efectiva la financiación. El importe total adeudado se corresponde con la suma de las mensualidades. El próximo ${fecha} se le cobrará su primer recibo.`),
        ),
        paragraph(text('En el caso de operación pre-autorizada en moneda extranjera, la aplicación del cambio de divisa podría hacer variar el importe final de sus cuotas.')),
        paragraph(
          text('Consulte el plan de pagos de su utilización a través del '),
          strong('Espacio Cliente'),
          text(' de '),
          link('cetelem.es', cta.href),
          text(' o a través de la '),
          strong('App Cetelem Móvil'),
          text(', donde podrá ver la cantidad exacta de cada una de las cuotas.'),
        ),
      ];
  }
}

function getCompraPlazosParagraphs(operacion: OperacionFinanciera, society: SocietyCode): readonly FinancialParagraph[] {
  const importe = formatAmount(operacion.importe);
  const mensualidad = formatAmount(operacion.mensualidad);
  const comision = formatAmount(operacion.comision);
  const totalAdeudado = formatAmount(operacion.impTotalAdeudado);
  const tin = formatPercent(operacion.tin);
  const tae = formatPercent(operacion.tae);
  const fecha = formatDate(operacion.fchProximoRecibo);

  const firstReceiptSentence =
    society === SOCIETY_CODES.CAJAMAR
      ? `El próximo ${fecha} se le enviará su primer recibo.`
      : `El próximo ${fecha} se le enviará su primer recibo. Recibirá por correo ordinario el Cuadro de Amortización con el detalle.`;

  return [
    paragraph(text(`Importe a financiar ${importe} € a devolver en ${operacion.meses} cuotas mensuales de ${mensualidad} €. Comisión formalización aplicada ${comision} € (1). Importe total adeudado es de ${totalAdeudado} €. TIN ${tin}, TAE ${tae}. ${firstReceiptSentence}`)),
    paragraph(text('(1) Se aplicarán junto con la primera mensualidad.')),
    paragraph(text('Código de la operación: '), strong(operacion.token)),
    paragraph(text("Si quiere confirmar esta operación, mándenos un sms con la palabra APLAZA espacio 'Código de la operación' al 215234.")),
  ];
}

function getPreautParagraphs(operacion: OperacionFinanciera, society: SocietyCode): readonly FinancialParagraph[] {
  const importe = formatAmount(operacion.importe);
  const mensualidad = formatAmount(operacion.mensualidad);
  const comision = formatAmount(operacion.comision);
  const tin = formatPercent(operacion.tin);
  const tae = formatPercent(operacion.tae);
  const fecha = formatDate(operacion.fchProximoRecibo);
  const cta = CTA_BY_SOCIETY[society];

  const firstParagraphBase = `Su utilización ha sido autorizada por ${importe} € a devolver en ${operacion.meses} cuotas mensuales de ${mensualidad} €. Esta operación aplica ${comision} € de comisión de formalización junto con la primera mensualidad. TIN ${tin}, TAE ${tae}. El próximo ${fecha}`;

  switch (society) {
    case SOCIETY_CODES.CAJAMAR:
      return [
        paragraph(text(`${firstParagraphBase} * se le cobrará su primer recibo.`)),
        smallParagraph(text('* La fecha del primer recibo podrá desplazarse en el tiempo, manteniéndose constante el número de cuotas mensuales, en función de la fecha de la aprobación definitiva de la operación.')),
      ];
    default:
      return [
        paragraph(
          text(`${firstParagraphBase} * se le cobrará su primer recibo. Recibirá por correo ordinario el cuadro de amortización con todo el detalle; también puede consultarlo a través del Espacio Cliente de `),
          link(cta.href.includes('cajamar') ? 'cajamarconsumo.es' : 'cetelem.es', cta.href),
          text('.'),
        ),
        smallParagraph(text('* La fecha del primer recibo podrá desplazarse en el tiempo, manteniéndose constante el número de cuotas mensuales, en función de la fecha de la aprobación definitiva de la operación.')),
      ];
  }
}

export function resolveSocietyCode(value: string | null | undefined): SocietyCode {
  switch (value) {
    case SOCIETY_CODES.CAJAMAR:
      return SOCIETY_CODES.CAJAMAR;
    case SOCIETY_CODES.XFERA:
      return SOCIETY_CODES.XFERA;
    default:
      return SOCIETY_CODES.DEFAULT;
  }
}

export function getFinancialViewContent(
  variant: FinancialViewVariant,
  operacion: OperacionFinanciera,
  society: SocietyCode,
): FinancialViewContent {
  const cta = CTA_BY_SOCIETY[society];

  switch (variant) {
    case 'compra-plazos':
      return {
        title: 'Datos de la operación',
        paragraphs: getCompraPlazosParagraphs(operacion, society),
        ctaLabel: cta.label,
        ctaHref: cta.href,
      };
    case 'preaut':
      return {
        title: 'Información',
        paragraphs: getPreautParagraphs(operacion, society),
        ctaLabel: cta.label,
        ctaHref: cta.href,
      };
    default:
      return {
        title: 'Información',
        paragraphs: getBaseParagraphs(operacion, society),
        ctaLabel: cta.label,
        ctaHref: cta.href,
      };
  }
}
