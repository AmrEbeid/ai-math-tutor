// Handler-level tests for api/auth/child-login.js — the password-flag bypass fix.
//
// The DB function verify_child_login returns the child's id even when the password is wrong,
// signalling the failure only via a `success` flag. These tests prove the handler now honors
// that flag (no token on a failed password) while still accepting valid logins across the
// possible return shapes (object vs one-row array, and a legacy shape with no success field).
//
// Mocks only lib/supabase.js (the RPC result) and lib/rate-limit.js (allow + no background
// timer); uses the real signChildToken pipeline. Requires --experimental-test-module-mocks.
import { test, mock } from 'node:test';
import assert from 'node:assert/strict';

process.env.CHILD_JWT_SECRET ||= 'test-child-secret-local-only';
process.env.SUPABASE_URL ||= 'http://localhost';
process.env.SUPABASE_SERVICE_ROLE_KEY ||= 'service-role-key-local-only';

let rpcResult = { data: null, error: null };

mock.module(new URL('../lib/supabase.js', import.meta.url).href, {
  namedExports: {
    createServerClient: () => ({ rpc: () => Promise.resolve(rpcResult) }),
    createAuthClient: () => null,
    getUser: async () => null,
  },
});

mock.module(new URL('../lib/rate-limit.js', import.meta.url).href, {
  namedExports: {
    checkRateLimit: () => ({ allowed: true, remaining: 9, resetIn: 900000 }),
    getClientIP: () => '127.0.0.1',
    RATE_LIMITS: { CHILD_LOGIN: { maxRequests: 10, windowMs: 900000 } },
  },
});

const { default: handler } = await import('../api/auth/child-login.js');

function makeReq(body) {
  return { method: 'POST', body, headers: {} };
}
function makeRes() {
  return {
    statusCode: 200, body: null,
    setHeader() {},
    status(c) { this.statusCode = c; return this; },
    json(o) { this.body = o; return this; },
    end() { return this; },
  };
}
const creds = { parent_email: 'parent@example.com', username: 'kid', password: 'pw' };

test('wrong password (child_id present, success:false) is rejected — bypass closed', async () => {
  rpcResult = { data: { child_id: 'child-A', parent_id: 'parent-1', success: false }, error: null };
  const res = makeRes();
  await handler(makeReq(creds), res);
  assert.equal(res.statusCode, 401);
  assert.equal(res.body.token, undefined);
});

test('unknown username (null child_id, success:false) is rejected', async () => {
  rpcResult = { data: { child_id: null, parent_id: null, success: false }, error: null };
  const res = makeRes();
  await handler(makeReq(creds), res);
  assert.equal(res.statusCode, 401);
});

test('correct password (object with success:true) issues a token', async () => {
  rpcResult = {
    data: { child_id: 'child-A', parent_id: 'parent-1', name: 'Kid', grade: 5, language: 'en', credits: 7, success: true },
    error: null,
  };
  const res = makeRes();
  await handler(makeReq(creds), res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(typeof res.body.token, 'string');
  assert.ok(res.body.token.length > 0);
  assert.equal(res.body.child.id, 'child-A');
  assert.equal(res.body.credits, 7);
});

test('one-row array result with success:true is normalized and accepted', async () => {
  rpcResult = {
    data: [{ child_id: 'child-A', parent_id: 'parent-1', name: 'Kid', grade: 5, language: 'en', success: true }],
    error: null,
  };
  const res = makeRes();
  await handler(makeReq(creds), res);
  assert.equal(res.statusCode, 200);
  assert.equal(typeof res.body.token, 'string');
});

test('legacy shape with a child_id but no success field still logs in (no false-reject)', async () => {
  rpcResult = { data: { child_id: 'child-A', parent_id: 'parent-1', name: 'Kid', grade: 5, language: 'en' }, error: null };
  const res = makeRes();
  await handler(makeReq(creds), res);
  assert.equal(res.statusCode, 200);
  assert.equal(typeof res.body.token, 'string');
});

test('RPC error is rejected as invalid credentials', async () => {
  rpcResult = { data: null, error: { message: 'boom' } };
  const res = makeRes();
  await handler(makeReq(creds), res);
  assert.equal(res.statusCode, 401);
});

test('missing credentials yields 400 before any DB call', async () => {
  rpcResult = { data: { child_id: 'child-A', success: true }, error: null };
  const res = makeRes();
  await handler(makeReq({ parent_email: 'parent@example.com' }), res);
  assert.equal(res.statusCode, 400);
});
