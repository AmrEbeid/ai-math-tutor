# SPEC-SLICE — Instant Dual-Channel Safety Alerts DESIGN (T-10)

> **Purpose:** Design for **instant, dual-channel** parent alerts when a child shows distress, shares
> personal information, or gets stuck — building on the safety detection + in-app notifications that
> already exist, and adding a reliable second channel (email/push) for the high-severity cases.
> **Status:** Drafted (design-only) — awaiting GPT + owner review. **Risk:** Low to write;
> **High to implement** — child-safety path + a second delivery channel (no email/push infra yet) +
> likely a migration (parent alert prefs/contact). All hard gates.
> **Grounds in:** the live detection (`lib/prompts.js` `detectChildDistress`/`detectPersonalInfo`),
> the in-app notification inserts + per-session dedup (`api/chat.js`), `public/safety.html`, and the
> CLAUDE.md child-safety + no-PII rules. **Companion:** shares the email-channel decision with
> [`SPEC-SLICE-weekly-digest`](SPEC-SLICE-weekly-digest.md) §0.
> **Discipline:** No product code from this doc. Implementation is a separate gated slice.

---

## 0. What exists today (FACTS — verified in code)

- **Detection (synchronous, pre-AI):** `detectChildDistress(message)` and `detectPersonalInfo(message)`
  run on the child's message **before** the model call in `api/chat.js`; `detectStuckLoop(history)` runs
  on the thread.
- **In-app alert (exists):** each fires an insert into `notifications`
  (`type` ∈ `child_distress` / `personal_info_shared` / `stuck_loop`), **deduped once per session per
  type** via `hasSessionNotification()`. `stuck_loop` also flips `sessions.status`.
- **Channel gap:** there is **only one channel today — in-app**. No email/push/SMS sender exists
  (same finding as the weekly-digest slice). "Dual-channel" is the missing piece.
- **Parent-facing promise:** `public/safety.html` already tells parents they'll be alerted — this slice
  makes that promise *instant + multi-channel* and truthful.

---

## 1. Goal & severity model (DESIGN)

Make high-severity safety signals reach a parent **immediately on more than one channel**, while keeping
low-severity signals in-app only (avoid alert fatigue).

| Signal | Severity | Channels | Dedup |
|---|---|---|---|
| `child_distress` (distress/fear/bullying/self-harm cues) | **High** | in-app **+ email/push (instant)** | once per session; **re-alert if it recurs in a new session** |
| `personal_info_shared` | **Medium** | in-app (instant) + email **batched/optional** | once per session |
| `stuck_loop` | **Low** | in-app only | once per session |

> Distress is the case that must never be missed; it justifies the second channel even at the cost of
> an occasional false positive. PII/stuck stay lighter to prevent fatigue.

---

## 2. Delivery design (where, not code)

1. **In-app stays the durable record** — the existing `notifications` insert is the source of truth and
   the fallback if the second channel fails. It is written **first**, synchronously (as today).
2. **Second channel dispatch** for High severity: after the in-app insert, enqueue/dispatch an
   email (and/or web-push) to the parent. Dispatch is **best-effort and non-blocking** to the child's
   chat turn — a channel failure must never break the tutoring response or lose the in-app alert.
3. **Reliability:** record per-alert delivery status (e.g. `notifications.delivered_channels` /
   `alert_status`) so a failed email can be retried by a sweeper, and so the dashboard can show
   "alerted via …". (New column = migration.)
4. **Latency:** "instant" = dispatched within the same request for in-app, and immediately enqueued for
   email/push (seconds), **not** the weekly batch.

---

## 3. Privacy & content rules (CLAUDE.md — non-negotiable)

- The alert states **that** a safety signal occurred and links to the **in-app session** for review.
- **No child message content, no quotes, no PII** in the email/push body — ever. (The parent reads the
  transcript in-app, behind auth.)
- Title/body templates are fixed strings (mirroring the current in-app copy), not model-generated.
- Email/push metadata (subject, preview) must not leak content either (e.g. subject = "A safety check
  for your child's session," not the trigger phrase).

---

## 4. Parent contact & preferences (DESIGN)

- Email target = the parent account email (already present); **push** requires a stored subscription
  (new table/column = migration) and a service worker push handler (the app already ships `sw.js`).
- Preferences: parents may choose channels per severity (e.g. distress → email always on; PII → in-app
  only). A `profiles` preference column/table (**migration**) — default **distress email ON**.
- Quiet hours are **not** applied to High severity (safety overrides convenience).

---

## 5. Acceptance (for the FUTURE gated implementation — not this task)

- Distress detection writes the in-app alert **and** dispatches the second channel; a second-channel
  failure leaves the in-app alert intact and is retried.
- No child content/PII appears in any email/push payload or log (asserted in tests on the templating).
- Dedup: one alert per session per type; distress re-alerts across distinct sessions.
- The child's chat turn is never blocked or failed by alert dispatch.
- `public/safety.html` claims stay truthful to what's implemented.

## 6. Gates (CLAUDE.md)

- 🔴 **Hard gates** to implement: child-safety path changes; email/push provider dependency + secret +
  external service; web-push subscription storage; Supabase migration (delivery-status + parent
  alert-preference columns). Explicit owner approval + review required.
- 🟡 **Medium / phase-1 candidate:** a **non-blocking dispatch seam** in `api/chat.js` (a no-op
  `dispatchAlert()` that only writes the existing in-app notification) — refactor-only, no new channel,
  so the channel can be slotted in later without touching the detection/credit path again.
  → **DONE (severity config):** `lib/alerts.js` (+`tests/alerts.test.mjs`, +6 tests) ships the §1 model
  as pure config — `ALERT_POLICY` (distress=High in-app+email+push, personal-info=Medium, stuck=Low
  in-app) + `alertPlanFor` / `needsSecondChannel` / `secondaryChannels`, in-app always included, unknown
  → safe Low/in-app default. **Pure and UNWIRED.** Remaining for this seam: the `api/chat.js` refactor to
  route the existing in-app inserts through a `dispatchAlert()` that consumes this config (chat path → its
  own reviewed slice).
- This doc is **docs-only, low-risk**.

## 7. Open gaps

- **Email/push provider undecided** — shared decision with the weekly-digest slice (§0 there).
- **Web-push** needs VAPID keys + a subscription table + `sw.js` push/notificationclick handlers.
- **Distress pattern tuning** — false-positive rate vs. miss rate should be measured; high severity
  tolerates false positives, but fatigue is real.
- **Escalation policy** for repeated distress (e.g. surface resources / encourage offline help) — needs
  child-safety + possibly legal review before wording.
- **Delivery-status + preference columns** must be reconciled against `supabase/migrations/live/`.
