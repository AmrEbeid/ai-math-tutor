// Per-action credit costs — the single source of truth for what each tutoring action costs.
//
// Design: docs/specs/SPEC-SLICE-pricing-credits-impl.md §2. This is the "shadow-mode config"
// step-1 of the per-action-metering migration: PURE CONFIG, intentionally NOT yet wired into
// deduction. api/chat.js still meters by message count (1 credit / 5 text, 1 / 2 image);
// switching it to use creditCostForTurn() is a SEPARATE, GATED slice (credit/payment logic +
// an RPC that accepts an amount). Keeping the table here — tested and unused — makes that
// future cutover a small, low-risk edit instead of inventing costs inline under a hard gate.

export const ACTION_CREDIT_COSTS = Object.freeze({
  text_exchange: 1,   // a normal chat turn (the core unit)
  image_solve: 3,     // vision: higher token + image cost; still routes to guided steps
  voice_exchange: 2,  // future (voice-enabled plans only)
  practice_set: 2,    // future practice-set generator
  quiz_gen: 2,        // future quiz / exam mode
  mistake_report: 1,  // future mistake-analysis report
  weekly_plan: 0,     // system batch job; internal cost absorbed
  reread_cached: 0,   // re-reading an existing reply; no new generation
});

// Safe default for an unrecognized action: charge the base text cost. Never silently free
// (which would undercharge) nor a wild overcharge. New actions MUST be added to the map above.
export const DEFAULT_ACTION_COST = ACTION_CREDIT_COSTS.text_exchange;

// Cost for a named action, with the safe default for anything not in the table.
export function creditCostForAction(action) {
  const cost = ACTION_CREDIT_COSTS[action];
  return Number.isFinite(cost) ? cost : DEFAULT_ACTION_COST;
}

// Derive the action + its cost for a chat turn from the request SHAPE — server-side only,
// never trusted from the client (same principle as deriving child_id from the session row).
// Today: an image attachment → image_solve; otherwise a plain text_exchange.
export function creditCostForTurn({ image } = {}) {
  return creditCostForAction(image ? 'image_solve' : 'text_exchange');
}
