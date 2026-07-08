# Image Assets — Migration Inventory

> **Module**: #28 — Image Assets Migration (GH-8)
> **Migrated**: 2026-07-08
> **Total**: 107 images (776 KB) across 3 image directories

## Directory Structure

```
public/images/
├── common/         50 images (427 KB) — Shared/default images for all societies (sociedad 400)
├── cajamar/        52 images (315 KB) — Cajamar-branded variants (sociedad 600)
├── xfera/           5 images  (34 KB) — Xfera-specific branding (sociedad 800)
└── README.md                       — This inventory manifest
```

## Source → Destination Mapping

### 1. Source: `resources/img/` (Legacy root)
**Destination**: `public/images/common/`

These are the default/shared images used by all societies. They include icons, logos, background images, and UI elements.

| File | Size | Notes |
|------|------|-------|
| ayuda_numero.png | 180 KB | Help number illustration |
| bola.png | 0.9 KB | Bullet/dot indicator |
| bolaBlanca.png | 1 KB | White bullet (from `resources/images/`) |
| bolaBlanca_ok_noOk.png | 2.9 KB | OK/not-OK indicator (from `resources/images/`) |
| favicon.ico | 4.2 KB | Favicon |
| fondoMenuIzda.png | 3.9 KB | Left menu background |
| fondoMenuIzdaBase.png | 1 KB | Left menu base |
| fondoMenuIzdaBase_responsive.png | 1 KB | Left menu base (responsive) |
| fondoMenuIzdaOpcionActual.png | 3 KB | Left menu current option bg |
| fondoMenuIzdaOpcionActual_responsive.png | 3.9 KB | Left menu current option (responsive) |
| fondoMenuIzdaOpcionVisitada.png | 3.9 KB | Left menu visited option bg |
| fondoMenuIzdaOpcionVisitada_responsive.png | 4.9 KB | Left menu visited option (responsive) |
| fondoMenuIzda_responsive.png | 4.9 KB | Left menu background (responsive) |
| ico_advertencia.png | 2.6 KB | Warning icon |
| ico_advertencia2.png | 1.5 KB | Warning icon variant |
| ico_advertencia2blanco.png | 1.3 KB | Warning icon white variant |
| ico_advertencia3.png | 6.3 KB | Warning icon large |
| ico_candado.png | 1.1 KB | Lock icon |
| ico_cara.png | 6.3 KB | Face/smiley icon |
| ico_cerrar.png | 1.1 KB | Close icon |
| ico_diploma.png | 1.8 KB | Diploma icon |
| ico_diplomaVerde.png | 1.8 KB | Green diploma icon |
| ico_documentos.png | 1.5 KB | Documents icon |
| ico_firmayDoc.png | 1.2 KB | Sign document icon |
| ico_firmayDocBlanco.png | 1.2 KB | Sign document icon white |
| ico_flechaBlanca.png | 1.1 KB | White arrow |
| ico_flechaDerecha.png | 1.1 KB | Right arrow |
| ico_flechaDerecha2.png | 1.3 KB | Right arrow variant |
| ico_flechaIzquierda2.png | 1.3 KB | Left arrow variant |
| ico_flechaVerde.png | 1.4 KB | Green arrow |
| ico_info.png | 1.7 KB | Info icon |
| ico_interrogante.png | 1.3 KB | Question mark icon |
| ico_lupaSobreDocumento.png | 3.4 KB | Magnifying glass over doc |
| ico_manoGrandeOk.png | 5.4 KB | Hand OK gesture |
| ico_ok.png | 1.1 KB | OK icon |
| ico_ok2.png | 1.1 KB | OK icon variant |
| ico_salir.png | 1.6 KB | Exit icon |
| ico_solicitudAprobada.png | 1.4 KB | Approved request icon |
| ico_solicitudAprobadaBlanca.png | 1.4 KB | Approved request icon white |
| ico_solicitudPendiente.png | 1.2 KB | Pending request icon |
| ico_solicitudPendienteBlanco.png | 1.1 KB | Pending request icon white |
| ico_telefonoGrande.png | 1.8 KB | Large phone icon |
| ico_verificDoc.png | 1.3 KB | Verify document icon |
| ico_verificDocBlanco.png | 1.2 KB | Verify document icon white |
| logo.png | 27.3 KB | Default logo (Cetelem/sociedad 400) |
| logo_bnp.png | 5.9 KB | BNP Paribas logo |
| movil_intro_cod_confirmacion.png | 7.1 KB | Mobile confirmation code illustration |
| muneco_grande.png | 108 KB | Large character illustration |
| nubeSubidaDoc.png | 2.3 KB | Upload cloud icon |
| okCirculo.png | 2.2 KB | OK circle indicator |

### 2. Source: `resources/img/cajamar/` (Legacy Cajamar)
**Destination**: `public/images/cajamar/`

Cajamar-branded variants of common images. Files that are **identical** to common counterparts are kept for path consistency (the Angular app can reference `images/cajamar/logo.png` vs `images/common/logo.png` based on the active society).

#### Cajamar-Only Files (no common equivalent)
| File | Size | Notes |
|------|------|-------|
| ayuda_numero2.jpg | 24.2 KB | Help number illustration (JPEG) |
| cargandoBlanco.png | 1.8 KB | White loading indicator (static PNG) |
| ico_tel1.png | 2.8 KB | Phone icon variant |
| ico_tel2.png | 2.6 KB | Phone icon variant |
| xVentanaEnlaces.png | 1.2 KB | Window/enlaces icon |

#### Society-Specific Variants (different from common)
| File | Size | Notes |
|------|------|-------|
| ayuda_numero.png | 171.9 KB | Different dimensions/crop |
| ico_advertencia.png | 2.7 KB | Different color |
| ico_advertencia2.png | 1.5 KB | Different color |
| ico_advertencia2blanco.png | 1.3 KB | Different color |
| ico_advertencia3.png | 6.4 KB | Different color |
| ico_cara.png | 6.3 KB | Different color |
| ico_flechaDerecha2.png | 1.3 KB | Different color |
| ico_flechaIzquierda2.png | 1.3 KB | Different color |
| ico_info.png | 1.7 KB | Different color |
| ico_interrogante.png | 1.3 KB | Different color |
| ico_lupaSobreDocumento.png | 3.5 KB | Different color |
| ico_manoGrandeOk.png | 5.5 KB | Different color |
| logo.png | 4.9 KB | Cajamar-branded logo |
| movil_intro_cod_confirmacion.png | 7.5 KB | Different illustration |
| nubeSubidaDoc.png | 2.1 KB | Different color |
| okCirculo.png | 2.3 KB | Different color |
| ico_diplomaVerde.png | 1.8 KB | Different shade |
| ico_telefonoGrande.png | 1.8 KB | Different color |
| favicon.ico | 1.1 KB | Cajamar favicon |
| fondoMenuIzdaOpcionActual.png | 3 KB | Different background |
| bola.png | 0.9 KB | Different color |

#### Identical to Common (kept for path consistency)
| File | Size | Notes |
|------|------|-------|
| fondoMenuIzda.png | 3.9 KB | Same file |
| fondoMenuIzda_responsive.png | 4.9 KB | Same file |
| fondoMenuIzdaBase.png | 1 KB | Same file |
| fondoMenuIzdaBase_responsive.png | 1 KB | Same file |
| fondoMenuIzdaOpcionVisitada.png | 3.9 KB | Same file |
| fondoMenuIzdaOpcionVisitada_responsive.png | 4.9 KB | Same file |
| ico_candado.png | 1.1 KB | Same file |
| ico_cerrar.png | 1.1 KB | Same file |
| ico_diploma.png | 1.8 KB | Same file |
| ico_documentos.png | 1.5 KB | Same file |
| ico_firmayDoc.png | 1.2 KB | Same file |
| ico_firmayDocBlanco.png | 1.2 KB | Same file |
| ico_flechaBlanca.png | 1.1 KB | Same file |
| ico_flechaDerecha.png | 1.1 KB | Same file |
| ico_flechaVerde.png | 1.4 KB | Same file |
| ico_ok.png | 1.1 KB | Same file |
| ico_ok2.png | 1.1 KB | Same file |
| ico_salir.png | 1.6 KB | Same file |
| ico_solicitudAprobada.png | 1.4 KB | Same file |
| ico_solicitudAprobadaBlanca.png | 1.4 KB | Same file |
| ico_solicitudPendiente.png | 1.2 KB | Same file |
| ico_solicitudPendienteBlanco.png | 1.1 KB | Same file |
| ico_verificDoc.png | 1.3 KB | Same file |
| ico_verificDocBlanco.png | 1.2 KB | Same file |
| logo_bnp.png | 5.9 KB | Same file |

### 3. Source: `resources/img/xfera/` (Legacy Xfera)
**Destination**: `public/images/xfera/`

Xfera-specific images. These are unique to the Xfera brand and override the common images when society = Xfera.

| File | Size | Notes |
|------|------|-------|
| favicon.ico | 6.2 KB | Xfera favicon |
| ico_cara.png | 4.2 KB | Xfera face icon |
| logo.png | 6.2 KB | Xfera logo |
| logo_bnp.png | 5.9 KB | BNP Paribas logo |
| logo_footer.png | 11.1 KB | Xfera footer logo |

### 4. Source: `resources/images/` (Legacy secondary)
**Destination**: `public/images/common/`

| File | Size | Notes |
|------|------|-------|
| bolaBlanca.png | 1 KB | White bullet (used in form.css for step indicators) |
| bolaBlanca_ok_noOk.png | 2.9 KB | OK/not-OK indicator |

## Images NOT Migrated

The following legacy images were intentionally **not** copied:

| Image | Reason |
|-------|--------|
| `resources/img/cargando.gif` (10.2 KB) | Animated GIF — replaced with CSS loading spinner (see below) |
| `resources/img/cajamar/cargando.gif` (10.2 KB) | Same animated GIF, duplicated — replaced with CSS spinner |
| `resources/fonts/fontawesome-webfont.svg` | Font file, not an image — belongs to Font Awesome |
| `resources/fonts/glyphicons-halflings-regular.svg` | Font file, not an image — belongs to Glyphicons |
| `resources/fonts/icomoon.svg` | Font file, not an image — belongs to Icomoon |
| SVG images referenced in `cmcredit.css` (`../images/*.svg`) | SVG assets referenced in CSS that don't exist as files in the source — likely inline or artifact of incomplete legacy cleanup |

## `cargando.gif` → CSS Spinner Replacement

The legacy application used `cargando.gif` (10.2 KB animated GIF) as a loading indicator, referenced in:
- `style.css` line 590: `.zonaSubidaDocumento.cargando { background-image: url(../img/cargando.gif); }`
- `style_xfera.css` line 601-602: same pattern
- `cajamar.css` line 378-379: `.dv-document.cargando > label:after { background-image: url(../images/img/cargando.gif); }`

**Replacement**: Pure CSS loading spinner added to `src/styles.css`.

### CSS API

```css
/* Basic spinner */
<div class="loading-spinner"></div>

/* Small spinner */
<div class="loading-spinner loading-spinner--sm"></div>

/* Large spinner */
<div class="loading-spinner loading-spinner--lg"></div>

/* Overlay (full-screen centered spinner) */
<div class="loading-overlay">
  <div class="loading-spinner"></div>
</div>
```

### Tailwind Alternative (when Tailwind CSS is configured)

```html
<div class="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
```

### Design Notes
- No animated GIFs in the output — all replaced with CSS animations
- The spinner uses `border-top-color` trick for the spinning effect
- Size variants available: sm (1.25rem), default (2rem), lg (3rem)
- Color can be customized by overriding `border-top-color`

## Usage in Angular Components

### Referencing Images by Society

Create a service/method that returns the correct image path based on the current society:

```typescript
/**
 * Returns a root-relative image path safe for any Angular route depth.
 * Leading `/` ensures correct resolution from the app root regardless
 * of the current route nesting level.
 */
function getImagePath(imageName: string, society?: string): string {
  const base = '/images';
  if (society === 'cajamar') return `${base}/cajamar/${imageName}`;
  if (society === 'xfera') return `${base}/xfera/${imageName}`;
  return `${base}/common/${imageName}`;
}
```

### Template Usage

```html
<img [src]="getImagePath('logo.png', currentSociety())" alt="Logo" />
```

## Adding New Society-Specific Images

1. Create a new subdirectory under `public/images/` named after the society: `public/images/<society-name>/`
2. Only include images that differ from the `common/` defaults
3. Update this README with the new inventory
4. Update the `getImagePath()` utility to resolve the new society

## Migration Metadata

- **Migrated by**: MetaCoder (GH-8)
- **Migration date**: 2026-07-08
- **Source branch**: `feature/GH-8-image-assets`
- **Total files**: 107 (50 common + 52 Cajamar + 5 Xfera)
- **Total size**: 776 KB
- **Animated GIFs removed**: 2 (cargando.gif × 2 duplicates)
- **CSS spinner classes added**: 4 (.loading-spinner, --sm, --lg, .loading-overlay)
