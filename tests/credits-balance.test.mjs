// Handler-level tests for api/credits/balance.js — the parent-only billing-data fix.
//
// A child session token is widened to its parent's scope and uses the service-role client, so it
// must receive only the credit count, never the parent's payment history or subscription/billing
// metadata. These tests assert the child path never even queries credit_ledger/subscriptions, and
// the parent path still returns them.
//
// Mocks only lib/supabase.js; uses the real signed-token auth pipeline.
// Requires --experimental-test-module-mocks.
import { test, mock } from 'node:test';
import assert from 'node:assert/strict';

process.env.CHILD_JWT_SECRET ||= 'test-child-secret-local-only';
process.env.SUPABASE_URL ||= 'http://localhost';
process.env.SUPABASE_SERVICE_ROLE_KEY ||= 'service-role-key-local-only';

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
const { default: handler } = await import('../api/credits/balance.js');

function childToken({ child_id, parent_id }) {
  return signChildToken({
    child_id, parent_id, child_name: 'Kid', grade: 5, language: 'en',
    exp: Math.floor(Date.now() / 1000) + 3600,
  });
}

// Records every from(table)/rpc(name) call; responder(rec) returns its { data, error }.
function makeClient(responder) {
  const tables = [];
  const rpcs = [];
  function builder(name) {
    const rec = { name, ops: [] };
    const b = {};
    for (const m of ['select', 'eq', 'order', 'limit', 'in']) {
      b[m] = (...a) => { rec.ops.push([m, ...a]); return b; };
    }
    b.single = () => { rec.single = true; return b; };
    b.then = (resolve, reject) => { try { resolve(responder(rec)); } catch (e) { reject(e); } };
    return b;
  }
  return {
    tables, rpcs,
    from(t) { tables.push(t); return builder(t); },
    rpc(name) { rpcs.push(name); return Promise.resolve(responder({ name })); },
  };
}

function makeReq(token) {
  return { method: 'GET', headers: token ? { authorization: `Bearer ${token}` } : {} };
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

const responder = (rec) => {
  if (rec.name === 'get_credit_balance') return { data: 8, error: null };
  if (rec.name === 'credit_ledger') return { data: [{ id: 't1', stripe_payment_id: 'pi_secret', amount: 999 }], error: null };
  if (rec.name === 'subscriptions') return { data: { plan_name: 'pro', price_cents: 4999, stripe_customer_id: 'cus_secret' }, error: null };
  return { data: null, error: null };
};

test('child token gets only the credit count — no billing data is queried or returned', async () => {
  currentUser = null;
  currentClient = makeClient(responder);
  const token = childToken({ child_id: 'child-A', parent_id: 'parent-1' });

  const res = makeRes();
  await handler(makeReq(token), res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.credits, 8);
  assert.deepEqual(res.body.recent_transactions, []);
  assert.equal(res.body.subscription, null);
  // The leak fix: the billing tables must never be touched for a child token.
  assert.ok(!currentClient.tables.includes('credit_ledger'), 'credit_ledger not queried for a child');
  assert.ok(!currentClient.tables.includes('subscriptions'), 'subscriptions not queried for a child');
});

test('parent token still receives transactions and subscription', async () => {
  currentUser = { id: 'parent-1' };
  currentClient = makeClient(responder);

  const res = makeRes();
  await handler(makeReq('parent-jwt'), res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.credits, 8);
  assert.ok(currentClient.tables.includes('credit_ledger'));
  assert.ok(currentClient.tables.includes('subscriptions'));
  assert.equal(res.body.recent_transactions.length, 1);
  assert.equal(res.body.subscription.plan_name, 'pro');
});
