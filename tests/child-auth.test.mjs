// Tests for lib/child-auth.js HMAC child-token signing/verification.
// No network, no Supabase, no real secrets — a local test secret is set before import.
// Run: node --test tests/child-auth.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';

// Must be set BEFORE importing the module (it reads CHILD_JWT_SECRET at load time).
process.env.CHILD_JWT_SECRET = 'test-secret-local-only-not-real';
const { signChildToken, verifyChildToken } = await import('../lib/child-auth.js');

const basePayload = () => ({
  child_id: 'child-123',
  parent_id: 'parent-456',
  child_name: 'Test Child',
  grade: 5,
  language: 'en',
  exp: Math.floor(Date.now() / 1000) + 3600, // 1h in the future
});

test('valid signed token round-trips', () => {
  const token = signChildToken(basePayload());
  const decoded = verifyChildToken(token);
  assert.ok(decoded, 'expected a decoded payload');
  assert.equal(decoded.child_id, 'child-123');
  assert.equal(decoded.parent_id, 'parent-456');
});

test('forged token (tampered signature) is rejected', () => {
  const token = signChildToken(basePayload());
  const parts = token.split('.');
  parts[2] = parts[2].slice(0, -2) + (parts[2].endsWith('aa') ? 'bb' : 'aa'); // mutate signature
  assert.equal(verifyChildToken(parts.join('.')), null);
});

test('tampered payload (re-encoded body, old signature) is rejected', () => {
  const token = signChildToken(basePayload());
  const [header, , signature] = token.split('.');
  const forgedBody = Buffer.from(
    JSON.stringify({ ...basePayload(), parent_id: 'attacker-parent' })
  ).toString('base64url');
  assert.equal(verifyChildToken(`${header}.${forgedBody}.${signature}`), null);
});

test('expired token is rejected', () => {
  const expired = { ...basePayload(), exp: Math.floor(Date.now() / 1000) - 60 };
  const token = signChildToken(expired);
  assert.equal(verifyChildToken(token), null);
});

test('malformed token (wrong segment count) is rejected', () => {
  assert.equal(verifyChildToken('not-a-jwt'), null);
  assert.equal(verifyChildToken('only.two'), null);
});

test('signChildToken throws a secret-free error when CHILD_JWT_SECRET is missing', () => {
  const saved = process.env.CHILD_JWT_SECRET;
  delete process.env.CHILD_JWT_SECRET;
  try {
    assert.throws(() => signChildToken(basePayload()), (err) => {
      assert.match(err.message, /CHILD_JWT_SECRET/);                 // names the var
      assert.doesNotMatch(err.message, /test-secret-local-only-not-real/); // never the value
      return true;
    });
  } finally {
    process.env.CHILD_JWT_SECRET = saved;
  }
});

test('verifyChildToken fails closed (null) when CHILD_JWT_SECRET is missing', () => {
  const token = signChildToken(basePayload()); // signed while the secret is present
  const saved = process.env.CHILD_JWT_SECRET;
  delete process.env.CHILD_JWT_SECRET;
  try {
    assert.equal(verifyChildToken(token), null); // misconfigured server rejects all tokens
  } finally {
    process.env.CHILD_JWT_SECRET = saved;
  }
});
