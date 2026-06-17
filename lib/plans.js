// Plan / package catalog — internal credit + cap definitions per plan.
//
// Design: docs/specs/SPEC-SLICE-pricing-credits-impl.md §3 (catalog as config) + the internal
// matrix in SPEC-PRICING §4. This is the second half of the per-action-metering migration's
// step-1: PURE CONFIG, intentionally NOT yet wired into grants or caps. The Lemon Squeezy
// webhook still grants from its own `custom_data`, and api/chat.js reads caps from the
// `children.credit_limit_*` columns. Wiring grants/caps to this catalog is a SEPARATE, GATED
// slice (credit/payment + possibly migration). Keeping it here — tested and unused — makes that
// future cutover a small edit and gives one source of truth for plan numbers.
//
// `credits` is the granted allotment: a 7-day total for the trial, otherwise per month.
// `null` fields on later/deferred plans mean "not scoped yet" (School pilot).

export const PLANS = Object.freeze({
  free_trial: Object.freeze({
    key: 'free_trial', label: 'Free Trial',
    credits: 50, period: 'trial', trialDays: 7,
    dailyCap: 10, timeCapMinutes: 15, uploadCapPerDay: 3,
    maxChildren: 1, voice: false, active: true,
  }),
  family: Object.freeze({
    key: 'family', label: 'Family',
    credits: 600, period: 'month', trialDays: null,
    dailyCap: 20, timeCapMinutes: 30, uploadCapPerDay: 10,
    maxChildren: 2, voice: false, active: true,
  }),
  family_premium: Object.freeze({
    key: 'family_premium', label: 'Family Premium',
    credits: 1500, period: 'month', trialDays: null,
    dailyCap: 30, timeCapMinutes: 45, uploadCapPerDay: 50,
    maxChildren: 4, voice: true, active: true,
  }),
  // Later / optional — defined but not part of the first implementation slice.
  student_plus: Object.freeze({
    key: 'student_plus', label: 'Student Plus',
    credits: 1000, period: 'month', trialDays: null,
    dailyCap: 40, timeCapMinutes: 60, uploadCapPerDay: 50,
    maxChildren: 1, voice: true, active: false,
  }),
  // Deferred until classroom mode is scoped — per-seat numbers are TBD.
  school_pilot: Object.freeze({
    key: 'school_pilot', label: 'School/Teacher Pilot',
    credits: null, period: 'month', trialDays: null,
    dailyCap: null, timeCapMinutes: null, uploadCapPerDay: null,
    maxChildren: null, voice: null, active: false,
  }),
});

// A plan by key, or null if unknown.
export function getPlan(key) {
  return Object.prototype.hasOwnProperty.call(PLANS, key) ? PLANS[key] : null;
}

// Plans available in the first implementation slice (trial + the two family plans).
export function listActivePlans() {
  return Object.values(PLANS).filter(p => p.active);
}

export function isActivePlan(key) {
  const p = getPlan(key);
  return !!p && p.active;
}

// Defensively normalize a free-form plan name (e.g. a webhook `plan_name`) to a known plan key.
// Returns the key or null; callers must handle null rather than assume a default plan.
export function resolvePlanKey(name) {
  if (typeof name !== 'string') return null;
  const norm = name.trim().toLowerCase().replace(/[\s-]+/g, '_');
  return Object.prototype.hasOwnProperty.call(PLANS, norm) ? norm : null;
}
