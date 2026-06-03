// No-dependency server environment validation (STAGE1-C plan).
//
// SAFETY: this module never logs or returns secret VALUES — only variable NAMES.
// Error messages name the missing variable so misconfiguration fails fast and clearly,
// but never include the value. See docs/specs/SPEC-STAGE1-C-env-secret-validation-plan.md.

// Server env contract. `secret: true` MUST never reach the browser bundle.
export const SERVER_ENV = {
  SUPABASE_URL:                { required: true, secret: false, note: 'public-safe runtime config' },
  SUPABASE_ANON_KEY:           { required: true, secret: false, note: 'public-safe only if RLS enforced' },
  SUPABASE_SERVICE_ROLE_KEY:   { required: true, secret: true,  note: 'service-role / BYPASSRLS — server only' },
  OPENAI_API_KEY:              { required: true, secret: true,  note: 'AI provider secret' },
  LEMONSQUEEZY_API_KEY:        { required: true, secret: true,  note: 'payment API secret' },
  LEMONSQUEEZY_WEBHOOK_SECRET: { required: true, secret: true,  note: 'webhook signature secret' },
  CHILD_JWT_SECRET:            { required: true, secret: true,  note: 'child token HMAC secret — never log' },
  ALLOWED_ORIGIN:              { required: true, secret: false, note: 'CORS allowed origin' },
};

function isBlank(value) {
  return value === undefined || value === null || String(value).trim() === '';
}

/**
 * Return a required env var's value, or throw a secret-free error if missing/blank.
 * Use at the seam where the value is needed (fail fast with a clear message instead of
 * a downstream library error or a silent `undefined`).
 */
export function getEnv(name) {
  const value = process.env[name];
  if (isBlank(value)) throw new Error(`Missing required env var: ${name}`);
  return value;
}

/**
 * Validate a set of env vars (default: all `required` server vars). Throws a single
 * error listing the missing NAMES only — never values. Returns true when all present.
 */
export function validateServerEnv(names) {
  const toCheck = names || Object.keys(SERVER_ENV).filter((n) => SERVER_ENV[n].required);
  const missing = toCheck.filter((n) => isBlank(process.env[n]));
  if (missing.length > 0) {
    throw new Error(`Missing required env var(s): ${missing.join(', ')}`);
  }
  return true;
}

/**
 * CORS allowed origin. INTENTIONALLY request-time, not fail-fast: `ALLOWED_ORIGIN` is
 * deployment config (not a secret), and a blank value safely degrades to the permissive
 * `'*'` used by every endpoint today (acceptable because the API is bearer-token
 * authenticated and `Access-Control-Allow-Credentials` is never set). Production MUST set
 * a concrete origin — `validateServerEnv()` flags it as missing for boot/CI checks, while
 * this returns the documented `'*'` fallback at runtime so a missing value never 500s a
 * request. Returns the configured origin when set; `'*'` otherwise.
 */
export function getAllowedOrigin() {
  const value = process.env.ALLOWED_ORIGIN;
  return isBlank(value) ? '*' : value;
}
