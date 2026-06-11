// Handler-level tests for api/sessions/history.js — the cross-child access-control fix.
//
// Strategy: mock ONLY lib/supabase.js (so @supabase/supabase-js is never loaded and we can
// record the exact query filters the handler builds), but exercise the REAL auth pipeline by
// signing a genuine child token with lib/child-auth.js. We assert on the `.eq(...)` filters the
// handler applies, which is where the security boundary lives.
//
// Requires: node --experimental-test-module-mocks (set in the npm test script).
import { test, mock } from 'node:test';
import assert from 'node:assert/strict';

process.env.CHILD_JWT_SECRET ||= 'test-child-secret-local-only';
process.env.SUPABASE_URL ||= 'http://localhost';
process.env.SUPABASE_SERVICE_ROLE_KEY ||= 'service-role-key-local-only';

// Per-test swappable auth result + db client. createServerClient returns `currentClient`;
// getUser returns `currentUser` (null → getChildOrUser falls through to the child token).
let currentUser = null;
let currentClient = null;

mock.module(new URL('../lib/supabase.js', import.meta.url).href, {
  namedExports: {
    createServerClient: () => currentClient,
    createAuthClient: () => null,
    getUser: async () => currentUser,
  },
});

const { signChildToken } = await import('../lib/child-auth.js');
const { default: handler } = await import('../api/sessions/history.js');

function childToken({ child_id, parent_id }) {
  return signChildToken({
    child_id,
    parent_id,
    child_name: 'Test Kid',
    grade: 5,
    language: 'en',
    exp: Math.floor(Date.now() / 1000) + 3600,
  });
}

// A chainable, awaitable stand-in for a Supabase query builder that records every call.
function makeClient(result) {
  const ops = [];
  const builder = {
    select(...a) { ops.push(['select', ...a]); return builder; },
    eq(...a) { ops.push(['eq', ...a]); return builder; },
    order(...a) { ops.push(['order', ...a]); return builder; },
    limit(...a) { ops.push(['limit', ...a]); return builder; },
    then(resolve) { resolve(result); },
  };
  return { ops, from(t) { ops.push(['from', t]); return builder; } };
}

function makeReq({ query = {}, token } = {}) {
  return { method: 'GET', query, headers: token ? { authorization: `Bearer ${token}` } : {} };
}

function makeRes() {
  return {
    statusCode: 200,
    body: null,
    setHeader() {},
    status(c) { this.statusCode = c; return this; },
    json(o) { this.body = o; return this; },
    end() { return this; },
  };
}

const hasEq = (ops, col, val) => ops.some(([m, c, v]) => m === 'eq' && c === col && v === val);
const hasEqCol = (ops, col) => ops.some(([m, c]) => m === 'eq' && c === col);

test('child token is pinned to its own child_id and ignores a spoofed query child_id', async () => {
  currentUser = null;
  currentClient = makeClient({ data: [], error: null });
  const token = childToken({ child_id: 'child-A', parent_id: 'parent-1' });

  const res = makeRes();
  await handler(makeReq({ query: { child_id: 'child-B' }, token }), res);

  assert.equal(res.statusCode, 200);
  assert.ok(hasEq(currentClient.ops, 'parent_id', 'parent-1'), 'scopes to the token parent');
  assert.ok(hasEq(currentClient.ops, 'child_id', 'child-A'), 'forces the token child_id');
  assert.ok(!hasEq(currentClient.ops, 'child_id', 'child-B'), 'ignores the spoofed sibling child_id');
});

test('child token with no child_id query is still scoped to its own child', async () => {
  currentUser = null;
  currentClient = makeClient({ data: [], error: null });
  const token = childToken({ child_id: 'child-A', parent_id: 'parent-1' });

  const res = makeRes();
  await handler(makeReq({ query: {}, token }), res);

  assert.equal(res.statusCode, 200);
  assert.ok(hasEq(currentClient.ops, 'child_id', 'child-A'), 'cannot list across siblings');
  assert.ok(currentClient.ops.some(([m, v]) => m === 'limit' && v === 50));
});

test('child requesting a sibling session_id is still constrained to its own child_id', async () => {
  currentUser = null;
  currentClient = makeClient({ data: [], error: null });
  const token = childToken({ child_id: 'child-A', parent_id: 'parent-1' });

  const res = makeRes();
  await handler(makeReq({ query: { session_id: 'sess-belongs-to-sibling' }, token }), res);

  assert.equal(res.statusCode, 200);
  assert.ok(hasEq(currentClient.ops, 'id', 'sess-belongs-to-sibling'), 'filters by requested session id');
  assert.ok(hasEq(currentClient.ops, 'child_id', 'child-A'), 'AND by own child_id → sibling session yields nothing');
});

test('parent token may filter by an arbitrary child of its account', async () => {
  currentUser = { id: 'parent-1' };
  currentClient = makeClient({ data: [], error: null });

  const res = makeRes();
  await handler(makeReq({ query: { child_id: 'child-B' }, token: 'parent-jwt' }), res);

  assert.equal(res.statusCode, 200);
  assert.ok(hasEq(currentClient.ops, 'parent_id', 'parent-1'));
  assert.ok(hasEq(currentClient.ops, 'child_id', 'child-B'), 'parent-supplied child_id is honored');
});

test('parent token with no child_id lists all children (no child_id filter)', async () => {
  currentUser = { id: 'parent-1' };
  currentClient = makeClient({ data: [], error: null });

  const res = makeRes();
  await handler(makeReq({ query: {}, token: 'parent-jwt' }), res);

  assert.equal(res.statusCode, 200);
  assert.ok(hasEq(currentClient.ops, 'parent_id', 'parent-1'));
  assert.ok(!hasEqCol(currentClient.ops, 'child_id'), 'no child scoping for a parent listing all sessions');
});
