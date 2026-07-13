# Plan de pruebas de vistas OpenPencil

## Objetivo

Verificar que las composiciones diseñadas en OpenPencil se renderizan en Angular
manteniendo el flujo `legacy -> OpenPencil -> Angular`, las variantes de sociedad
y los estados funcionales principales.

## Flujo mock reproducible

Las pruebas de componentes usan `provideHttpClientTesting()` y
`HttpTestingController`. No necesitan backend ni datos persistidos:

1. Crear el componente con una ruta mock que contiene `token` y `sociedad`.
2. Interceptar `GET /api/gestion-token/info-sms-financiero`.
3. Responder con un fixture válido o con HTTP 404/500.
4. Ejecutar `fixture.detectChanges()` y comprobar texto, CTA, tarjetas y estado.
5. Verificar `httpMock.verify()` al terminar cada caso.

## Matriz mínima

| Vista | Sociedades | Success | Loading | Token inválido | Error servicio | Responsive |
|---|---|---:|---:|---:|---:|---:|
| `InfoOperacion` | 400, 600, 800 | Sí | Sí | Sí | Sí | Sí |
| `InfoOperacionCompraPlazos` | 400, 600, 800 | Sí | Sí | Sí | Sí | Sí |
| `InfoOperacionPreaut` | 400, 600, 800 | Sí | Sí | Sí | Sí | Sí |
| `InfoOperacionGenerica` | 800 | Sí | Según flujo | Sí | Sí | Sí |
| `Consentimientos` | 800 | Sí | Según flujo | N/A | Sí | Sí |
| `AceptarCotitular` | 800 | OTP enviado | Sí | OTP inválido | Sí | Sí |
| `Error` | Todas | N/A | N/A | Sí | Sí | Sí |
| `AceptaCesionOkModal` | 800 | Sí | N/A | N/A | N/A | Sí |

## Fixtures recomendados

### Operación financiera válida

```json
{
  "token": "MOCK-TOKEN-001",
  "importe": 12540,
  "mensualidad": 298.4,
  "meses": 48,
  "impTotalAdeudado": 14323.2,
  "comision": 180,
  "fchProximoRecibo": "2026-09-05",
  "tin": 7.95,
  "tae": 8.61,
  "valido": true,
  "tipoToken": "INFO_OPERACION"
}
```

### Respuestas de error

- `404`: mostrar token inválido o inexistente y acción de vuelta.
- `500`: mostrar error de servicio y acción de vuelta.
- Sin `token`: no realizar petición HTTP y mostrar error de entrada.

## Comandos

```bash
npm run test -- --watch=false
npm run build
```

Para una comprobación visual complementaria:

```bash
npm start
```

Después se prueban las rutas con query params, por ejemplo:
`/info-operacion?token=MOCK-TOKEN-001&sociedad=400`.

## Criterios de aceptación

- Las tarjetas financieras, el resumen y el CTA coinciden con el handoff de OpenPencil.
- Cada sociedad usa su copy y enlace de portal correspondiente.
- Loading, token inválido y error de servicio no dejan contenido de éxito visible.
- El modal de cesión se puede cerrar por botón, backdrop y Escape.
- La suite automatizada termina sin peticiones HTTP pendientes.
- El build Angular termina correctamente.
