# SPEC-child-token-storage-httpOnly-migration-plan

> Plan to move the child session token from `localStorage` to an httpOnly cookie.
> **Plan only — not implemented here.** Token-storage change is a hard gate requiring a
> dedicated approved implementation prompt.

**Status:** Drafted / awaiting GPT and user review.
**Date:** 2026-06-03
**Risk class:** High (auth/token); plan-only doc.

## 1. Current behavior
- `api/auth/child-login.js` issues a custom HMAC-SHA256 JWT (`CHILD_JWT_SECRET`, 24h exp).
- Stored in `localStorage` on the child device; sent as `Authorization: Bearer <token>`.
- Two key names observed (`child_token`, `zeluu_child_token`) — inconsistent.
- Verified by `lib/child-auth.js` `verifyChildToken` (HMAC); used by chat/sessions/children/credits.

## 2. Risks of localStorage token
- **XSS-exfiltratable** (any injected script can read `localStorage`) — high impact for a children's product.
- No automatic expiry/rotation beyond the 24h `exp`; no server-side revocation.
- Dual key names risk subtle auth/redirect bugs.

## 3. Target behavior
- Short-lived token delivered as **httpOnly + Secure + SameSite=Lax/Strict** cookie (not JS-readable).
- Optional refresh token (httpOnly) for silent renewal; access token short-lived.
- Single, standardized cookie name; remove the localStorage keys.
- CSRF protection for cookie-authed state-changing requests (double-submit token or SameSite=Strict + origin check).

## 4. Migration steps (future, approved)
1. Server: set the token via `Set-Cookie` (httpOnly/Secure/SameSite) at child-login; read it from the cookie in `getChildOrUser`.
2. Keep `Authorization: Bearer` acceptance temporarily for backward compatibility (dual-read window).
3. Frontend: stop writing/reading `child_token`/`zeluu_child_token` in `localStorage`; rely on the cookie (sent automatically).
4. Add CSRF token handling for child POSTs.
5. Standardize on one cookie name; remove legacy localStorage keys after the dual-read window.

## 5. API / frontend changes
- API: `child-login` (Set-Cookie), `lib/child-auth.js` (`getChildOrUser` reads cookie first, then Bearer during transition), CORS must allow credentials for the child origin (review `ALLOWED_ORIGIN` + `Access-Control-Allow-Credentials`).
- Frontend: `child-login.html` + `app.html` (drop localStorage token handling; logout clears cookie via server).

## 6. Backward compatibility / rollout
- Dual-read window (cookie OR Bearer) → migrate clients → drop Bearer/localStorage.
- Staged: deploy server dual-read first, then frontend switch.

## 7. Logout / session-expired
- Logout: server clears the cookie (`Set-Cookie` with Max-Age=0).
- Expired: 401 → the existing `app.html` session-expired branch redirects to `/child-login`.

## 8. CSRF considerations
- Cookies are auto-sent → CSRF risk for state-changing routes. Mitigate with SameSite + an anti-CSRF token (or strict origin checks) on child POSTs.

## 9. Tests required
- Cookie set on login (httpOnly/Secure/SameSite flags); cookie auth accepted; Bearer accepted during transition; expired/forged rejected; CSRF protection; logout clears cookie. (Node `node:test`, mocked.)

## 10. Rollback
- Revert to Bearer/localStorage path (kept during the dual-read window) if cookie auth misbehaves.

## 11. Why NOT in the current prompt
Token storage is a **hard gate** (auth-critical), needs CORS-credentials + CSRF design, frontend+API coordination, and a staged rollout — too large/risky for a closure batch. Execute via a dedicated approved prompt after PROD-GATE-1.

**Future prompt:** `STAGE2-TOKEN-1 — Child Token httpOnly Cookie Migration (design→impl)`.
