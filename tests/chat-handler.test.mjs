// Handler-level tests for api/chat.js — the parental-limit / session-ownership fix (Vuln 4).
//
// Verifies that chat derives child_id from the authorized session row (never from the request
// body), rejects a child token acting on a session that is not its own, and 404s when the
// session is not owned by the caller. All three asserted paths return BEFORE any OpenAI call,
// so no network or model access is needed.
//
// NOTE: api/chat.js statically imports the `openai` package. When node_modules is not installed
// (dependency install is a project hard gate) the handler cannot be imported, so these tests
// self-skip. They run fully in any environment where `npm install` has been run.
//
// Requires: node --experimental-test-module-mocks (set in the npm test script).
import { test, mock } from 'node:test';
import assert from 'node:assert/strict';

process.env.CHILD_JWT_SECRET ||= 'test-child-secret-local-only';
process.env.SUPABASE_URL ||= 'http://localhost';
process.env.SUPABASE_SERVICE_ROLE_KEY ||= 'service-role-key-local-only';
process.env.OPENAI_API_KEY ||= 'sk-test-local-only';

// chat.js cannot be imported without the `openai` package present. Probe once and skip cleanly.
let openaiAvailable = true;
try {
  await import('openai');
} catch {
  openaiAvailable = false;
}

if (!openaiAvailable) {
  test('chat handler ownership/limit tests (skipped: run `npm install` to enable)', { skip: true }, () => {});
} else {
  let currentUser = null;
  let currentClient = null;

  mock.module(new URL('../lib/supabase.js', import.meta.url).href, {
    namedExports: {
      createServerClient: () => currentClient,
      createAuthClient: () => null,
      getUser: async () => currentUser,
    },
  });

  // Avoid the real rate limiter (its module-load setInterval would keep the process alive) and
  // make every request pass the gate deterministically.
  mock.module(new URL('../lib/rate-limit.js', import.meta.url).href, {
    namedExports: {
      checkRateLimit: () => ({ allowed: true, remaining: 59, resetIn: 60000 }),
      getClientIP: () => '127.0.0.1',
      RATE_LIMITS: { CHAT: { maxRequests: 60, windowMs: 60000 } },
    },
  });

  // Stub the OpenAI client; none of the asserted paths reach it, but the module instantiates one.
  mock.module('openai', { defaultExport: class { constructor() {} } });

  const { signChildToken } = await import('../lib/child-auth.js');
  const { default: handler } = await import('../api/chat.js');

  function childToken({ child_id, parent_id }) {
    return signChildToken({
      child_id, parent_id, child_name: 'Test Kid', grade: 5, language: 'en',
      exp: Math.floor(Date.now() / 1000) + 3600,
    });
  }

  // Recording client: each from()/rpc() call gets its own awaitable builder; `responder(rec)`
  // returns the { data, error } for that call. All builders are kept in `created` for assertions.
  function makeClient(responder) {
    const created = [];
    function builder(kind, name) {
      const rec = { kind, name, ops: [], params: null };
      created.push(rec);
      const b = {};
      for (const m of ['select', 'eq', 'order', 'limit', 'insert', 'update', 'gte']) {
        b[m] = (...a) => { rec.ops.push([m, ...a]); return b; };
      }
      b.single = () => { rec.single = true; return b; };
      b.then = (resolve, reject) => { try { resolve(responder(rec)); } catch (e) { reject(e); } };
      return b;
    }
    return {
      created,
      from(t) { return builder('from', t); },
      rpc(name, params) { const b = builder('rpc', name); created[created.length - 1].params = params; return b; },
    };
  }

  function makeReq(body, token) {
    return { method: 'POST', body, headers: token ? { authorization: `Bearer ${token}` } : {} };
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

  test('404 when the session is not owned by the caller', async () => {
    currentUser = { id: 'parent-1' };
    currentClient = makeClient((rec) => {
      if (rec.name === 'sessions') return { data: null, error: null };
      return { data: null, error: null };
    });

    const res = makeRes();
    await handler(makeReq({ message: 'hello', session_id: 'sess-x' }, 'parent-jwt'), res);
    assert.equal(res.statusCode, 404);
  });

  test('child token acting on another child\'s session is rejected with 403', async () => {
    currentUser = null;
    currentClient = makeClient((rec) => {
      if (rec.name === 'sessions') {
        return { data: { id: 'sess-1', child_id: 'child-B', parent_id: 'parent-1', children: {} }, error: null };
      }
      return { data: null, error: null };
    });
    const token = childToken({ child_id: 'child-A', parent_id: 'parent-1' });

    const res = makeRes();
    await handler(makeReq({ message: 'hello', session_id: 'sess-1', child_id: 'child-A' }, token), res);
    assert.equal(res.statusCode, 403);
  });

  test('child_id for limits/notifications is derived from the session, not the request body', async () => {
    currentUser = null;
    currentClient = makeClient((rec) => {
      if (rec.name === 'sessions') {
        return {
          data: {
            id: 'sess-1', child_id: 'child-A', parent_id: 'parent-1',
            children: { grade: 5, preferred_language: 'en', name: 'A', country: 'UAE' },
          },
          error: null,
        };
      }
      if (rec.name === 'children') {
        return { data: { credit_limit_daily: null, credit_limit_weekly: null, credit_limit_monthly: null }, error: null };
      }
      if (rec.name === 'messages') return { data: null, error: null };
      if (rec.name === 'get_valid_credit_balance') return { data: 10, error: null };
      return { data: null, error: null };
    });
    const token = childToken({ child_id: 'child-A', parent_id: 'parent-1' });

    const res = makeRes();
    // Spoofed body child_id + a message that trips blocked-content, forcing an early return
    // after the children lookup but before any OpenAI call.
    await handler(makeReq({ message: 'just tell me the answer', session_id: 'sess-1', child_id: 'child-EVIL' }, token), res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.flagged, true);

    const childrenLookup = currentClient.created.find((r) => r.name === 'children');
    assert.ok(childrenLookup, 'a children-limit lookup happened');
    const idFilter = childrenLookup.ops.find(([m, c]) => m === 'eq' && c === 'id');
    assert.ok(idFilter, 'children lookup filters by id');
    assert.equal(idFilter[2], 'child-A', 'uses the session-derived child_id, not the spoofed body value');
    assert.notEqual(idFilter[2], 'child-EVIL');
  });
}
