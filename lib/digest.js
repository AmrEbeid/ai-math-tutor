// Weekly parent-digest aggregation — PURE functions over already-fetched rows.
//
// Design: docs/specs/SPEC-SLICE-weekly-digest.md (§2 content, §3 mechanism). This is the
// "read-only aggregation" phase-1 building block: it takes plain session/message/notification
// rows (already scoped to one child + one week by the caller) and returns AGGREGATES ONLY —
// time-on-task, counts, distinct subjects/topics, and safety-flag counts. It NEVER reads or
// returns message content, names, or any PII, satisfying the CLAUDE.md privacy rule for the
// digest. It is intentionally UNWIRED: no DB, no email, no Supabase import — the gated slice
// feeds it real rows and decides delivery. Resolves the design's open "time-on-task definition
// (idle-gap capping)" question with tested logic.

// Gaps between consecutive messages longer than this are treated as the child being away,
// not working — each gap is capped at this many minutes so a long pause can't inflate the total.
export const IDLE_GAP_CAP_MINUTES = 10;

// Normalize a timestamp (epoch ms number or ISO string) to epoch ms, or NaN if unparseable.
function toMs(t) {
  if (typeof t === 'number') return Number.isFinite(t) ? t : NaN;
  if (typeof t === 'string') { const d = Date.parse(t); return Number.isNaN(d) ? NaN : d; }
  return NaN;
}

// Active minutes implied by a set of message timestamps within one session: sum the gaps
// between consecutive (sorted) messages, capping each gap at the idle cap. 0 or 1 message → 0.
export function timeOnTaskMinutes(timestamps = [], { idleGapCapMinutes = IDLE_GAP_CAP_MINUTES } = {}) {
  const ms = (Array.isArray(timestamps) ? timestamps : []).map(toMs).filter(Number.isFinite).sort((a, b) => a - b);
  if (ms.length < 2) return 0;
  const capMs = Math.max(0, idleGapCapMinutes) * 60000;
  let total = 0;
  for (let i = 1; i < ms.length; i++) total += Math.min(ms[i] - ms[i - 1], capMs);
  return Math.round(total / 60000);
}

// Safety-flag notification types surfaced in the digest (counts only — never content).
export const DIGEST_FLAG_TYPES = Object.freeze(['child_distress', 'personal_info_shared', 'stuck_loop']);

// Aggregate one child's week. Inputs are already-fetched, already-scoped plain rows:
//   sessions:      [{ id, subject, topic, ... }]
//   messages:      [{ session_id, role, created_at }]   (content is NOT read)
//   notifications: [{ type, ... }]
// Returns aggregates only — safe to put in an email/log.
export function summarizeWeek({ sessions = [], messages = [], notifications = [] } = {}) {
  const bySession = new Map();
  for (const m of messages) {
    if (!bySession.has(m.session_id)) bySession.set(m.session_id, []);
    bySession.get(m.session_id).push(m.created_at);
  }
  let timeOnTask = 0;
  for (const ts of bySession.values()) timeOnTask += timeOnTaskMinutes(ts);

  const questions = messages.filter(m => m.role === 'user').length;
  const subjects = [...new Set(sessions.map(s => s.subject).filter(Boolean))];
  const topics = [...new Set(sessions.map(s => s.topic).filter(Boolean))];

  const safetyFlags = {};
  for (const type of DIGEST_FLAG_TYPES) safetyFlags[type] = notifications.filter(n => n.type === type).length;
  const safetyFlagTotal = DIGEST_FLAG_TYPES.reduce((sum, t) => sum + safetyFlags[t], 0);

  return {
    sessions: sessions.length,
    questions,
    timeOnTaskMinutes: timeOnTask,
    subjects,
    topics,
    safetyFlags,
    safetyFlagTotal,
  };
}
