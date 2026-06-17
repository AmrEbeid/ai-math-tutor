# Zeluu AI Math Tutor — Project Brief

**Last Updated:** May 2026 | **Live Repository:** `/Users/amrebeidhome/Documents/Claude/Projects/Zeluu/ai-math-tutor/`

---

## System Overview

Zeluu is a parent-controlled AI tutoring platform for children ages 6-15 (Grades 1-9) across the GCC/MENA region and UK. Parents purchase credits and manage child accounts; children log in independently with username/password and interact with an AI tutor in Math, Science, and English. The platform uses Vercel for deployment, Supabase for real-time database and authentication, OpenAI for embeddings and chat completeness, and LemonSqueezy for payment processing. A custom knowledge pipeline (Python) discovers educational YouTube content, downloads transcripts, processes them into embeddings, and injects teaching examples into the tutor's responses via RAG (Retrieval-Augmented Generation).

**Core Architecture:** Vercel Edge Functions (API routes) + Supabase RLS + OpenAI GPT-4 + LemonSqueezy + Knowledge Pipeline (GitHub Actions + Local Download).

---

## Database Schema

The Supabase schema includes the following key tables:

**users:** Parent accounts (Supabase Auth). Fields: id (UUID), email, created_at, metadata.

**children:** Child profiles under a parent. Fields: id (UUID), parent_id (FK), name, grade (1-9), country (ISO: AE, SA, EG, etc.), preferred_language (en/ar), username (unique, set by parent), password_hash (hashed by `set_child_password` RPC), credits (integer), created_at. Indexes on parent_id and username for fast lookups.

**sessions:** Tutoring chat sessions. Fields: id (UUID), parent_id (FK), child_id (FK), subject (math/science/english), start_time, end_time, message_count, credits_used, created_at. Both parent and child can read via RLS.

**messages:** Individual chat messages in a session. Fields: id (UUID), session_id (FK), role (user/assistant), content (text), created_at. RLS ensures only parent or child in that session can read.

**knowledge_channels:** Curated YouTube channels. Fields: id (UUID), channel_id (string), title, description, subscriber_count, video_count, url, tags (JSONB array: {country, subject, grade}), last_updated.

**knowledge_transcripts:** Full video transcripts. Fields: id (UUID), video_id, channel_id (FK), title, duration_secs, text, language (en/ar/fr), created_at.

**knowledge_chunks:** Processed transcript chunks for RAG embedding. Fields: id (UUID), transcript_id (FK), chunk_index, text (1500 chars), embedding (pgvector, 1536-dim), language, country, subject, grade, topics (JSONB), created_at. Index on embedding for similarity search.

**subscriptions:** Active parent subscriptions. Fields: id (UUID), parent_id (FK), plan_name, billing_cycle (monthly/annual), status (active/cancelled/expired), stripe_subscription_id, credits_allocated, renews_at, created_at.

**credit_transactions:** Log of all credit movements. Fields: id (UUID), parent_id (FK), transaction_type (purchase/usage/grant), amount, session_id (nullable), order_id (from LemonSqueezy), created_at.

RLS policies enforce: parents read/write only their own data; children read only their own sessions; knowledge tables are public read.

---

## System Prompts & Tutor Behavior

**File:** `/lib/prompts.js` (449 lines)

The system prompt is dynamically built by `getSystemPrompt(grade, language, country, subject)`. It bakes in:

- **Curriculum context:** 13 countries mapped (UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, Oman, Egypt, UK, US, Jordan, India, Lebanon, Morocco) with curriculum names, teaching methods, grade structures, and local examples (currency, landmarks, cuisine context).
- **Age banding:** Three bands (Lower: Gr 1-3, Middle: Gr 4-6, Upper: Gr 7-9) with age-appropriate tone, autonomy rules, and session length guidance.
- **Child Safety Framework (UNICEF/ICO/5Rights-compliant):** Core rules include no PII collection, no manipulation/sarcasm, safe distress handling, never pretending to be human, encouraging parent oversight. Handoff triggers flag CHILD_DISTRESS, STUCK_LOOP, OFF_TOPIC_REPEAT, PERSONAL_INFO.
- **Math Answer Release Policy (L1-L5 scaffolding):** L1=Clarify, L2=Hint, L3=Scaffold, L4=Partial Solve, L5=Full Reveal (only after L3-L4 fail or explicit request after 2+ attempts).
- **Tutoring modes:** Auto-detect TEACH, HINT, QUIZ, STORY, CALM, STEP-BY-STEP, RECAP based on message content and history.
- **Subject-specific rules:** Math uses step-by-step calculations, science emphasizes scientific method and thought experiments, English shows grammar examples with before/after.
- **Blocked patterns:** Regex list of jailbreak attempts (ignore_instructions, system_prompt, roleplay, etc.) returns safe redirect response.
- **Safety detectors:** Functions for stuck loops (6+ messages with error/correction patterns), child distress (regex patterns for sadness, bullying, self-harm), personal information sharing (name, address, school, phone, age).

All responses must be 150-300 words, end with a child participation prompt, and use specific praise ("You noticed the pattern!") over generic ("Great job!").

---

## Authentication & Authorization

**Dual-Auth System:** Parents use Supabase email/password auth; children use custom JWT tokens.

**Parent Auth:** Supabase JavaScript SDK with email/password signUp/signIn. Session stored as Supabase JWT in localStorage. `/api/*` endpoints extract Supabase user from `Authorization: Bearer {jwt}` header via `getUser(req)` helper.

**Child Auth:** Parents set username/password via `/api/children/set-credentials` (verified parent + RPC call to `set_child_password`). Child logs in at `/child-login` with credentials, triggering POST `/api/auth/child-login` which calls RPC `verify_child_login(username, password)`. On success, server returns custom JWT signed with `process.env.CHILD_JWT_SECRET` (HMAC-SHA256), expires in 24 hours. Token stored in localStorage as `child_token`. All subsequent requests from child app include `Authorization: Bearer {child_token}`.

**Dual-Auth Helper:** `lib/child-auth.js` exports:
- `signChildToken(payload)` — creates HMAC-SHA256 JWT
- `verifyChildToken(token)` — decodes and validates signature
- `getChildOrUser(req)` — tries parent Supabase auth first, falls back to child JWT
- `getParentId(authContext)` — extracts parent_id from either auth type
- `getChildId(authContext)` — extracts child_id from child-only context

All protected `/api/*` endpoints use `getChildOrUser(req)` and extract `parentId` for credit/session operations.

---

## Rate Limiting

**File:** `/lib/rate-limit.js`

Implements sliding-window rate limiting per IP address via in-memory counter map. Constants: `RATE_LIMITS = { chat: { max: 60, window: 60000 }, ... }` (60 messages per minute per IP). Clients exceeding limit get 429 status. Middleware in `/api/chat.js` calls `checkRateLimit(ip, 'chat')` on every request.

---

## API Routes

**Chat Endpoint** (`/api/chat.js`, POST): Core tutoring loop. Input: `{ message, session_id, child_id, subject?, language?, country? }`. Process: (1) Dual-auth + rate limit, (2) Fetch session history from DB, (3) Run RAG retrieval on knowledge_chunks matching grade/country/subject, (4) Build system prompt with curriculum + RAG context, (5) Call OpenAI GPT-4 with messages + system prompt, (6) Save response to DB, (7) Deduct credit via RPC `deduct_credit(parent_id, session_id)`. Returns: `{ message: "...", session_id, credits_remaining }`.

**Sessions** (`/api/sessions/create.js`, POST): Create new session. Input: `{ child_id, subject }`. Output: `{ session_id }`. Uses `parentId` for ownership verification.

**Credits** (`/api/credits/balance.js`, GET): Fetch credit balance. Returns: `{ balance, transactions (last 10), subscription }`. Dual-auth support.

**Child Auth** (`/api/auth/child-login.js`, POST): Login child. Input: `{ username, password }`. RPC call to `verify_child_login()` returns child metadata + parent_id. Response: `{ token, child: { id, name, grade, language }, credits }`.

**Children Management** (`/api/children.js`): Consolidated into single file to respect Vercel's 12-function limit. Actions: list children (GET), add child (POST), set credentials (PUT), delete child (DELETE). All parent-only via Supabase auth.

**Exams** (`/api/exams.js`, POST): Unified exam endpoint. Actions: `generate` (create AI-powered quiz), `submit` (grade answers), `history` (fetch past exams). Supports question_types: multiple_choice, true_false, short_answer, fill_blank.

**Webhooks** (`/api/webhooks/lemonsqueezy.js`, POST): LemonSqueezy payment events. Listens for `order_created` (paid subscription/pack), calculates credits to grant (trial=10 free credits, otherwise custom_data.credits), calls RPC `add_credits()`, logs transaction. HMAC-SHA256 signature verification on raw body.

**Checkout** (`/api/credits/checkout.js`, POST): Initiate LemonSqueezy checkout. Input: `{ product_id, custom_data: { user_id, credits, product_type, max_children, ... } }`. Returns checkout session URL.

All endpoints: CORS headers `Access-Control-Allow-Origin: *`, maxDuration 30 seconds in Vercel config.

---

## Chat Engine & RAG Pipeline

**RAG Workflow** (in `/api/chat.js`):

1. Generate embedding for child's question using OpenAI's `text-embedding-3-small` (1536 dimensions).
2. Query Supabase RPC `match_knowledge_chunks()` with `match_threshold=0.65`, filtered by child's grade, country, subject.
3. If no results, retry with threshold 0.7 and no country filter (broader fallback).
4. Build RAG context block: "TEACHING REFERENCE MATERIAL (from top educational channels): [Example 1 — Arabic source, topics: ... | first 800 chars] [Example 2 — ...] Remember: Use as STYLE references, teach in your own words."
5. Inject RAG context into system prompt before OpenAI call.

This grounds responses in real teacher methodology from curated YouTube channels (Khan Academy, regional teacher channels, etc.).

---

## Vercel Configuration & Deployment

**File:** `/vercel.json`

Configuration includes API max duration (30 seconds), rewrites for all routes (/login, /child-login, /app, /dashboard, /pricing, /verify-email, /privacy, /terms, /refund, /gdpr), and security headers (CSP, X-Content-Type-Options nosniff, X-Frame-Options DENY, strict Referrer-Policy, Permissions-Policy restricting camera/microphone/geolocation).

CSP restricts scripts to self + cdn.jsdelivr.net + unpkg.com, styles from self + Google Fonts, connects to Supabase + LemonSqueezy APIs.

---

## PWA & Service Worker

**File:** `/public/sw.js` (service worker, ~150 lines)

Implements cache-first strategy for static assets (JS, CSS, HTML) and network-first for API calls. Caches app.html on install; on fetch, tries network first for `/api/*` requests, falls back to cache. Prevents stale cached HTML from blocking updates (cache busting via versioning in install event).

---

## Knowledge Pipeline

**Purpose:** Automatically discover educational YouTube channels, download transcripts, process into embedding chunks, and inject as RAG context into tutor responses.

**Flow (5 Steps):**

1. **Discover Channels** (`discover_channels.py`): Uses GPT-4 with web browsing to find teacher-led educational channels per country/subject/grade. Output: `channels.json`.

2. **Download Transcripts** (`download_transcripts.py` + `download_local.py`): Must run on LOCAL machine (residential IP) because YouTube blocks subtitle access from cloud providers (GitHub, AWS, etc.). Uses yt-dlp to extract subtitle JSON3 for each video. Output: `transcripts/` folder + `channels.json` + `download_progress.json`.

3. **Process & Chunk** (`process_and_chunk.py`): Reads transcripts, splits into 1500-char chunks with 200-char overlap, adds metadata tags (country, subject, grade, topics). Output: `chunks.json`.

4. **Upload to Drive** (`upload_to_drive.py`): Uses Google service account to upload channels.json + chunks.json to shared Google Drive folder (Zeluu_Knowledge_Base). Non-fatal if fails.

5. **Store Embeddings** (`store_embeddings.py`): Embeds each chunk using OpenAI `text-embedding-3-small`, stores in Supabase knowledge_chunks table with pgvector. Critical step.

**Config** (`config.py`):
- Countries: 9 (BH, KW, JO, LB, MA, AE, EG, SA, UK)
- Subjects: math, science, english
- Grades: 1-9
- Seed channels: 51 curated teacher-led channels (Khan Academy, regional tutors per country)
- Chunk size: 1500 chars, overlap: 200 chars
- YouTube settings: max 5 channels per query, 50 videos per channel, 60 sec min duration, 5400 sec max
- Drive folder: https://drive.google.com/drive/folders/1uFrdxrKzBGiZaNo3TzTLnd_aGVXeLj3f

**Transcripts Schema:** Each transcript JSON file contains: video_id, video_title, channel_id, channel_title, duration_secs, view_count, tags (array of {country, subject, grade}), transcript (array of {start, duration, text}). Currently: 195 transcript files from 48+ channels.

**GitHub Actions** (`knowledge-pipeline.yml`): Scheduled monthly (cron 0 3 1 * *) and manual trigger. Runs on ubuntu-latest, Python 3.11, installs yt-dlp, tests API keys, executes pipeline steps 3-5 (steps 1-2 skipped on cloud to avoid YouTube IP blocks). Uploads artifacts to GitHub. Summary posted to step summary.

---

## Public Routes & Static Pages

- `/login` → `/login.html`: Parent login (Supabase auth, redirects to `/dashboard` if authenticated)
- `/child-login` → `/child-login.html`: Child login (username/password, redirects to `/app` if authenticated)
- `/app` → `/app.html`: Chat interface (child-only, no Supabase CDN, uses child_token JWT, shows child name + credits)
- `/dashboard` → `/dashboard.html`: Parent management (Your Children section with credentials modal, Recent Sessions with transcript viewer)
- `/pricing` → `/pricing.html`: Pricing plans (linked to LemonSqueezy checkout)
- `/index.html`: Landing page (public)
- `/privacy`, `/terms`, `/refund`, `/gdpr`, `/verify-email`: Legal/compliance pages

---

## LemonSqueezy Integration

**Webhook Endpoint:** `/api/webhooks/lemonsqueezy.js`

Listens for `order_created` event. Payload includes: `meta.custom_data = { user_id, product_type (subscription/pack), credits, plan_name, max_children, billing_cycle }`. On `status === 'paid'`:

1. Determine if trial ($0 charge) → grant 10 free credits; otherwise use custom_data.credits.
2. Call RPC `add_credits(user_id, amount, description)`.
3. Update/create subscription record (plan_name, billing_cycle, credits_allocated, renews_at).
4. Log transaction in credit_transactions table.

HMAC-SHA256 verification on raw body using `process.env.LEMONSQUEEZY_WEBHOOK_SECRET`.

---

## Setup Guide Walkthrough

The `SETUP_GUIDE.md` walks through dual-authentication setup for production deployment. Quick setup: (1) Generate 32-char random secret: `openssl rand -hex 16`, (2) Add `CHILD_JWT_SECRET` to Vercel env vars, (3) Deploy: `vercel deploy`. Database requires `verify_child_login` and `set_child_password` RPCs. User flows: Parent signup → dashboard → adds child → sets credentials; Child → /child-login → JWT token → /app chat interface.

---

## Deployment Checklist Highlights

Pre-deployment: Verify npm builds, no syntax errors, Vercel linked. Config: Generate CHILD_JWT_SECRET, add to Vercel env vars, verify existing vars. Database: Add username + password_hash columns to children table, create username index, implement RPCs. File verification: Verify all new files created, all modified files updated. Code quality: No console errors, all CORS headers present, no hardcoded secrets. Manual testing: 8 test scenarios (parent registration, child credentials, child login, chat, transcripts, token expiration, invalid credentials, CORS). Deployment: Commit, `vercel deploy --prod`, test in production. Post-deployment: Monitor Vercel logs, Supabase RPCs, credit accuracy, session loading (target <1s).

---

## GitHub Actions & CI

**Workflow File:** `.github/workflows/knowledge-pipeline.yml`

Scheduled trigger: 1st of month at 03:00 UTC. Manual trigger: workflow_dispatch with optional step selector. Steps: Checkout, Python 3.11 setup, install dependencies, verify yt-dlp, write Google service account key, test API keys, run pipeline (default steps 3-5), upload artifacts, post summary.

---

## Recent Commit History (Last 30)

**Themes:**

1. **Dual Authentication & Child Safety:** Implement parent-child JWT dual auth, child safety framework, fix child-login loops
2. **Multi-Subject Expansion:** Add Science & English, exam prep mode, child tutor behavior framework
3. **Knowledge Pipeline & Transcripts:** Add 193 transcripts from 48 channels, yt-dlp multi-lane downloader, local download script
4. **Vercel Architecture:** Consolidate APIs (children, exams) due to 12-function limit
5. **Mobile & UX Fixes:** Improve mobile layout, fix service worker caching race conditions
6. **Subscription Lifecycle & Billing:** Trial credit grants, LemonSqueezy webhook integration

---

## Environment Variables

| Variable | Usage Files | Purpose |
|---|---|---|
| `OPENAI_API_KEY` | `/api/chat.js`, `/api/exams.js`, knowledge pipeline | GPT-4 chat + text-embedding-3-small |
| `SUPABASE_URL` | `/lib/supabase.js`, `/api/**/*.js`, pipeline | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | `/lib/supabase.js`, pipeline | Server-side RPC calls |
| `SUPABASE_ANON_KEY` | `/public/js/supabase-config.js` | Public anon key (parent auth) |
| `CHILD_JWT_SECRET` | `/lib/child-auth.js` | HMAC-SHA256 key for child JWT (32-char hex) |
| `LEMONSQUEEZY_API_KEY` | `/api/credits/checkout.js` | API key for checkout sessions |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | `/api/webhooks/lemonsqueezy.js` | Webhook HMAC secret |
| `GOOGLE_SERVICE_ACCOUNT_KEY` (path) | Knowledge pipeline | Google Cloud service account JSON path |

---

## What's NEW vs the Snapshot Brief

1. **Knowledge Pipeline (Entire new system):** Python orchestration, discovery, download, processing, embeddings, GitHub Actions
2. **RAG Integration in Chat:** Queries knowledge_chunks via pgvector, injects teaching examples
3. **Dual Authentication:** Child JWT tokens, parent credentials management, separate login pages
4. **Exam/Quiz Mode:** generate/submit/history actions, multiple question types
5. **Multi-Subject Support:** Math, Science, English with curriculum-aware prompts
6. **Child Safety Framework:** UNICEF/ICO/5Rights-compliant safeguards
7. **Documentation:** SETUP_GUIDE.md, DEPLOYMENT_CHECKLIST.md, IMPLEMENTATION_SUMMARY.md
8. **API Consolidation:** Single children.js, unified exams.js endpoint
9. **Vercel Config Expansion:** Security headers, multiple route rewrites
10. **LemonSqueezy Webhook:** order_created event handling, trial credits
11. **Service Worker & PWA:** Cache-first static, network-first API
12. **Rate Limiting:** Per-IP sliding-window rate limiting

