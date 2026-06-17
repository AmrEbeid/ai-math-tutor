# SPEC-SLICE — Weekly Parent Digest DESIGN (T-04)

> **Purpose:** Design for a weekly per-parent digest summarizing each child's learning and any
> safety flags — delivered by email (and mirrored in-app) on a scheduled job.
> **Status:** Drafted (design-only) — awaiting GPT + owner review. **Risk:** Low to write;
> **High to implement** — needs an **email channel (does not exist yet)**, a **pg_cron job**, and
> likely a **Supabase migration** (opt-out flag + a `weekly_digest` notification type). All hard gates.
> **Grounds in:** the live `notifications` pipeline (`api/chat.js`), `sessions`/`messages` schema,
> the existing pg_cron job (`enforce-subscription-expiry`, daily 03:00 UTC), pricing spec §3
> ("Weekly report" is a paid-plan feature), and the privacy rule in `CLAUDE.md`.
> **Discipline:** No product code written from this doc. Implementation is a separate gated slice.

---

## 0. The blocking question (decide first)

**There is no email-sending infrastructure in the codebase today** — no Resend/SendGrid/Postmark/
nodemailer/Mailgun client in `api/` or `lib/`. The weekly digest's headline value is *email*, so the
first owner decision is **how email is sent**:

| Option | Notes | Gate |
|---|---|---|
| **Resend / Postmark / SendGrid** (HTTP API) | Cleanest for transactional email; no SMTP. Adds a dependency + API key. | dependency install + external service + secret = **hard gate** |
| **Supabase Auth email / SMTP** | Reuses existing auth email transport if configured; limited templating. | config + possibly SMTP creds = **hard gate** |
| **In-app only (phase 1)** | Ship the digest as an in-app `notifications` row now; add email later. | smaller — still needs the `weekly_digest` type (migration) |

> **Recommendation:** phase it — **in-app digest first** (no new vendor), **email second** once the
> provider is chosen. This delivers value behind no new dependency while the email gate is resolved.

---

## 1. What exists today (FACTS — verified in code/schema)

- **`notifications`** table: `parent_id`, `type`, `title`, `body`, `session_id` (insert pattern in
  `api/chat.js`). Live `notifications_type_check` already allows the safety types
  (`child_distress`, `personal_info_shared`, `stuck_loop`, `credits_low`, …) — a **new
  `weekly_digest` type would require extending that CHECK = migration**.
- **Safety flags** are already captured as notifications: `child_distress`, `personal_info_shared`,
  `stuck_loop` (with per-session dedup). The digest can **aggregate counts** of these per child/week.
- **`sessions`**: `child_id`, `subject`, `topic`, `status`, `created_at` → subjects/topics covered.
- **`messages`**: `role`, `content`, `created_at`, `tokens_used`, `session_id` → activity counts and
  **time-on-task** (derive from first/last message timestamps per session; never read `content`).
- **pg_cron is available**: `enforce-subscription-expiry` runs `0 3 * * *`. A weekly job follows the
  same `cron.schedule(...)` pattern.

---

## 2. Digest content (DESIGN — aggregates only, privacy-first)

Per parent, one digest covering all their children for the past 7 days:

| Item | Source | Privacy note |
|---|---|---|
| Time on task (per child) | `messages.created_at` span per session, summed | derived aggregate; no content |
| Sessions / questions count | count of `sessions` / user `messages` | aggregate |
| Subjects & topics touched | distinct `sessions.subject` / `sessions.topic` | topic titles only (no transcript) |
| Safety flags | count of `child_distress` / `personal_info_shared` / `stuck_loop` notifications | **count + "review the session" link only** |
| Credits/usage | `get_valid_credit_balance` + ledger deltas | internal "usage" framing (pricing §0) |
| Encouragement line | templated | no model call needed |

**Hard privacy rules (CLAUDE.md):**
- **No child message content** in the email body or logs — ever.
- **No PII beyond aggregates** — counts, durations, subject/topic labels; never quotes.
- Safety flags link to the in-app session for review; the email states *that* a flag occurred, not its
  content.
- Parent-facing framing = "learning time / usage," not "credits" (pricing spec §0).

---

## 3. Mechanism (DESIGN — where, not code)

1. **Aggregation:** a `weekly_child_summary(p_parent_id, p_since)` RPC (or a read-only query in an
   API/edge function) that returns the §2 aggregates from `sessions`/`messages`/`notifications`.
   Pure read; no content selected.
2. **Compose + record:** build the digest; insert one in-app `notifications` row
   (`type:'weekly_digest'`) per parent so it shows in the dashboard regardless of email.
3. **Send email (phase 2):** hand the composed digest to the chosen provider; never include content.
4. **Schedule:** `cron.schedule('weekly-parent-digest', '0 8 * * 1', 'SELECT public.run_weekly_digests()')`
   (Mon 08:00 — confirm timezone vs. the live 03:00 UTC job). The cron function fans out per active
   parent and **respects opt-out** (§4).
5. **Idempotency:** a digest is emitted at most once per parent per ISO week (dedup on
   `type:'weekly_digest'` + week key, mirroring the existing per-session/24h dedup patterns).

---

## 4. Opt-out (DESIGN)

- A per-parent preference (e.g. `profiles.weekly_digest_opt_out boolean default false`, **new column =
  migration**) checked before composing/sending. Opted-out parents get neither email nor in-app row.
- Email footer carries an unsubscribe affordance that flips the same flag (phase 2).

---

## 5. Acceptance (for the FUTURE gated implementation — not this task)

- Digest contains time-on-task, subjects/topics, and safety-flag **counts** — **no message content,
  no PII beyond aggregates** (asserted in tests on the aggregation function).
- Opt-out fully honored (no email, no in-app row).
- At most one digest per parent per week (idempotent).
- Paid-plan gating per pricing spec (Family+ get weekly; trial gets an end-of-trial summary).
- Cron job verified in `cron.job`; failure of one parent's digest does not abort the batch.

## 6. Gates (CLAUDE.md)

- 🔴 **Hard gates** to implement: email-provider dependency + secret + external service; `pg_cron`
  schedule; Supabase migration (`weekly_digest` type CHECK, opt-out column, aggregation RPC);
  any send to a real parent address. Explicit owner approval + review required.
- 🟡 **Medium / phase-1 candidate:** a **read-only** aggregation function + an **in-app-only**
  `notifications` digest (still needs the type-CHECK migration, so still gated on that one migration).
- This doc is **docs-only, low-risk**.

## 7. Open gaps

- **Email provider undecided** (§0) — the gating decision; pick before any build.
- **Timezone/run-time** for the weekly job (parent-local vs. a single UTC slot).
- **`weekly_digest` type + opt-out column** must be reconciled against `supabase/migrations/live/`
  before the migration (mirror the live `notifications_type_check`, do not regress its extra types).
- **Plan gating** specifics (which plans get email vs. in-app only) follow the pricing spec rollout.
- **Time-on-task definition** (idle-gap capping) to avoid overcounting long pauses between messages.
