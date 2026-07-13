# Deployment Guide

## Production build

```bash
npm install
npm run build:prod
```

The generated static output is written to `dist/migrated-app/browser/`.

## Hosting model

- Deploy the generated files to a static host, CDN, or nginx container.
- Serve `index.html` as the SPA fallback for any non-file route.
- Proxy `/api/*` requests to the backend service.

## Included deployment artifacts

- `public/_redirects` — SPA fallback example for Netlify/static hosts.
- `ops/nginx/migrated-app.conf` — nginx example with `try_files` SPA fallback and `/api/` reverse proxy.

## Angular build configuration

- `outputMode: "static"` for fully static deployment output.
- `outputPath: "dist/migrated-app"` to keep build artifacts predictable.
- Production file replacement: `environment.ts` → `environment.prod.ts`.
- Production budgets:
  - `initial`: warn at `500kB`, error at `1MB`
  - `anyComponentStyle`: warn at `4kB`, error at `8kB`

## Current known warning

The current production bundle still exceeds the `500kB` initial warning threshold.
This warning is intentional and remains visible until bundle optimization work reduces the main chunk size.
