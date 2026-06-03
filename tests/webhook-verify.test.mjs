// Tests for lib/webhook-verify.js — LemonSqueezy raw-body HMAC signature check.
// No network, no Supabase, no real secrets. Run: node --test tests/webhook-verify.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { verifyLemonSqueezySignature } from '../lib/webhook-verify.js';

const SECRET = 'test-webhook-secret-local-only';
const body = Buffer.from(JSON.stringify({ meta: { event_name: 'order_created' }, data: { id: '1' } }));
const goodSig = crypto.createHmac('sha256', SECRET).update(body).digest('hex');

test('valid signature is accepted', () => {
  assert.equal(verifyLemonSqueezySignature(body, goodSig, SECRET), true);
});

test('wrong-secret signature is rejected', () => {
  const bad = crypto.createHmac('sha256', 'wrong-secret').update(body).digest('hex');
  assert.equal(verifyLemonSqueezySignature(body, bad, SECRET), false);
});

test('tampered body is rejected (raw-body integrity)', () => {
  const tampered = Buffer.from(JSON.stringify({ meta: { event_name: 'tampered' }, data: { id: '1' } }));
  assert.equal(verifyLemonSqueezySignature(tampered, goodSig, SECRET), false);
});

test('length-mismatched signature is rejected without throwing', () => {
  assert.equal(verifyLemonSqueezySignature(body, 'short', SECRET), false);
});

test('missing/blank signature is rejected', () => {
  assert.equal(verifyLemonSqueezySignature(body, '', SECRET), false);
  assert.equal(verifyLemonSqueezySignature(body, undefined, SECRET), false);
});

test('missing secret throws (server misconfiguration)', () => {
  assert.throws(() => verifyLemonSqueezySignature(body, goodSig, ''), /not set/);
});
