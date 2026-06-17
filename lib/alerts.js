// Safety-alert severity → channel routing — PURE config.
//
// Design: docs/specs/SPEC-SLICE-safety-alerts.md §1 (severity model). This is the data half of
// the designed non-blocking `dispatchAlert()` seam: it maps a detected safety signal to a
// severity and the channels it should reach. It is intentionally UNWIRED — `api/chat.js` still
// writes the existing in-app notification directly; routing to a second channel (email/push) is
// a separate GATED slice (child-safety path + provider). Keeping the policy here, tested and
// unused, makes that future cutover a small edit and gives one source of truth for severity.
//
// Channel keys are abstract ('in_app' always exists today; 'email'/'push' are future, gated).
// In-app is ALWAYS included so the durable record/fallback is never skipped (design §2).

export const SEVERITY = Object.freeze({ HIGH: 'high', MEDIUM: 'medium', LOW: 'low' });

// Per safety-flag type: its severity and the channels it should reach (design §1 table).
// distress = High (in-app + email/push, instant); personal-info = Medium (in-app, email optional);
// stuck = Low (in-app only). Unknown types fall back to a safe Low / in-app-only.
export const ALERT_POLICY = Object.freeze({
  child_distress:        Object.freeze({ severity: SEVERITY.HIGH,   channels: Object.freeze(['in_app', 'email', 'push']) }),
  personal_info_shared:  Object.freeze({ severity: SEVERITY.MEDIUM, channels: Object.freeze(['in_app', 'email']) }),
  stuck_loop:            Object.freeze({ severity: SEVERITY.LOW,    channels: Object.freeze(['in_app']) }),
});

const SAFE_DEFAULT = Object.freeze({ severity: SEVERITY.LOW, channels: Object.freeze(['in_app']) });

// The {severity, channels} plan for a flag type. Unknown types → safe default (in-app only),
// never silently no-channel (the in-app record must always be written).
export function alertPlanFor(type) {
  return Object.prototype.hasOwnProperty.call(ALERT_POLICY, type) ? ALERT_POLICY[type] : SAFE_DEFAULT;
}

// Does this signal warrant a second (out-of-app) channel beyond the durable in-app record?
// True only for High severity (design: distress is the case that must never be missed).
export function needsSecondChannel(type) {
  return alertPlanFor(type).severity === SEVERITY.HIGH;
}

// The out-of-app channels for a type (everything except the always-on 'in_app').
export function secondaryChannels(type) {
  return alertPlanFor(type).channels.filter(c => c !== 'in_app');
}
