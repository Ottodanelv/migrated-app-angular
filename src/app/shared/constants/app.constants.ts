/**
 * Application-wide constants migrated from legacy gestionWeb.
 *
 * @source Legacy files:
 *   - {@link ../../../../legacy-app/gestionWeb/src/main/java/.../constantes/PathConstantes.java  PathConstantes}
 *   - {@link ../../../../legacy-app/gestionWeb/src/main/java/.../constantes/ModelConstantes.java ModelConstantes}
 *   - {@link ../../../../legacy-app/gestionWeb/src/main/java/.../constantes/ViewConstantes.java   ViewConstantes}
 *
 * @module shared/constants/app.constants
 * @see migration-plan.md#2-app-constants
 */

// ---------------------------------------------------------------------------
// Route Paths
// ---------------------------------------------------------------------------
// Migrated from: PathConstantes.java
// These are Angular route path segments used in app.routes.ts and Router.navigate().
// ---------------------------------------------------------------------------

/** All application route paths. Use these constants when calling `router.navigate()`. */
export const ROUTE_PATHS = {
  /** @source PATH_INFO_OPERACION_VALIDAR_TOKEN = "/infoOperacion" */
  INFO_OPERACION: 'info-operacion',
  /** @source PATH_INFO_OPERACION_COMPRA_PLAZOS = "gestion/gestionToken/infoOperacionCompraPlazos" */
  INFO_OPERACION_COMPRA_PLAZOS: 'info-operacion-compra-plazos',
  /** @source PATH_INFO_OPERACION_VALIDAR_TOKEN_GENERICO = "/infoOperacionGenerica" */
  INFO_OPERACION_GENERICA: 'info-operacion-generica',
  /** @source PATH_ENVIAR_OTP_COTITULAR = "/enviarOtpCotitular" */
  ENVIAR_OTP_COTITULAR: 'enviar-otp-cotitular',
  /** @source PATH_ACEPTACION_CESION_DATOS_COTITULAR = "/acepCot" */
  ACEPTAR_COTITULAR: 'aceptar-cotitular',
  /** Error page (no legacy constant; derived from web.xml error-page mappings) */
  ERROR: 'error',
} as const;

/** Type helper: union of all valid route paths. */
export type RoutePath = (typeof ROUTE_PATHS)[keyof typeof ROUTE_PATHS];

// ---------------------------------------------------------------------------
// Query Parameter Keys
// ---------------------------------------------------------------------------
// Migrated from: ModelConstantes.java attribute names used as request parameters.
// These replace `request.getParameter("token")` and similar patterns.
// ---------------------------------------------------------------------------

/** Query parameter names used across the application. */
export const QUERY_PARAMS = {
  /** @source ATRIBUTO_TOKEN = "token" */
  TOKEN: 'token',
  /** @source SOCIEDAD = "sociedad" */
  SOCIEDAD: 'sociedad',
} as const;

// ---------------------------------------------------------------------------
// Model Attribute Keys (Signal / State Keys)
// ---------------------------------------------------------------------------
// Migrated from: ModelConstantes.java
// Legacy `model.addAttribute("key", value)` → Angular Signal<T> or component property.
// These keys serve as documentation for the data contract between services and components.
// ---------------------------------------------------------------------------

/** Model attribute names — used as signal keys / component property names. */
export const MODEL_ATTRIBUTES = {
  /** @source DATOS_INFO_OPERACION_FINANCIERA = "infoOperacion" */
  INFO_OPERACION: 'infoOperacion',
  /** @source DATOS_INFO_OPERACION_GENERICA = "infoOperacionGenerica" */
  INFO_OPERACION_GENERICA: 'infoOperacionGenerica',
  /** @source MODEL_MENSAJE_ERROR = "mensajeError" */
  MENSAJE_ERROR: 'mensajeError',
  /** @source MODEL_LISTA_CONSENTIMIENTOS_CDAC = "lstConsentimientos" */
  LISTA_CONSENTIMIENTOS: 'lstConsentimientos',
} as const;

// ---------------------------------------------------------------------------
// Society Codes (Multi-Brand Support)
// ---------------------------------------------------------------------------
// Migrated from: ModelConstantes.SOCIEDAD + business logic
// The legacy app supports 3 brands via sociedad parameter: 400, 600, 800.
// These are used for CSS theming (data-sociedad attribute), API calls, and
// environment-specific configuration.
// ---------------------------------------------------------------------------

/** Society / brand identifiers. */
export const SOCIETY_CODES = {
  /** Default brand (Cetelem) */
  DEFAULT: '400',
  /** Cajamar brand */
  CAJAMAR: '600',
  /** Xfera brand */
  XFERA: '800',
} as const;

/** Type helper: valid society codes. */
export type SocietyCode = (typeof SOCIETY_CODES)[keyof typeof SOCIETY_CODES];

// ---------------------------------------------------------------------------
// Error Message Keys (for i18n translation files)
// ---------------------------------------------------------------------------
// Migrated from: error.properties message bundle
// These keys are used by the ErrorHandler and ErrorBanner components to resolve
// user-facing error messages from the i18n translation files.
// ---------------------------------------------------------------------------

/** Error message i18n keys. */
export const ERROR_KEYS = {
  /** Generic / unknown error */
  GENERIC: 'error.generico',
  /** Financial SMS token validation error */
  SMS_FINANCIERO_NO_VALIDO: 'error.gestionToken.sms.financiero.no.valido',
  /** Generic SMS token validation error */
  SMS_GENERICO_NO_VALIDO: 'error.gestionToken.sms.generico',
  /** Token expired */
  TOKEN_CADUCADO: 'error.gestionToken.caducado',
  /** Co-holder token error */
  TOKEN_COTITULAR: 'error.gestionToken.cotitular',
} as const;

// ---------------------------------------------------------------------------
// Legacy View Name Mapping (DOCUMENTATION ONLY — REMOVED concept)
// ---------------------------------------------------------------------------
// Migrated from: ViewConstantes.java
// Spring MVC view names (InternalResourceViewResolver) are REPLACED by
// Angular Router + Component references. The old strings are documented
// here for traceability during migration — they have no runtime equivalent.
//
// Legacy mapping:
//   "error/error"                              → ErrorComponent            (#23)
//   "gestion/gestionToken/infoOperacion"       → InfoOperacionComponent     (#11)
//   "gestion/gestionToken/infoOperacionPreaut" → InfoOperacionPreautComponent (#13)
//   "gestion/gestionToken/infoOperacionCompraPlazos" → InfoOperacionCompraPlazosComponent (#12)
//   "gestion/gestionToken/infoOperacionGenerica" → InfoOperacionGenericaComponent (#14)
//   "gestion/gestionToken/aceptaCesion"        → AceptaCesionComponent     (#15)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Feature Flags (placeholder — will be expanded in Module #3 Environment Config)
// ---------------------------------------------------------------------------

/** Application feature flags. Placeholder for Module #3. */
export const FEATURE_FLAGS = {
  /** Enable consent management UI (sociedad 800 only) */
  CONSENTIMIENTOS: false,
  /** Enable co-holder SMS flow */
  COTITULAR_SMS: false,
} as const;
