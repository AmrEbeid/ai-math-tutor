// Tests for lib/env.js server env validation + the .env.example contract.
// No secrets used; asserts errors never contain values. Run: node --test tests/env.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getEnv, validateServerEnv, SERVER_ENV } from '../lib/env.js';

test('getEnv returns a present value', () => {
  process.env.__ZEALTEST_PRESENT = 'value-here';
  assert.equal(getEnv('__ZEALTEST_PRESENT'), 'value-here');
  delete process.env.__ZEALTEST_PRESENT;
});

test('getEnv throws on a missing var, naming it but not its value', () => {
  delete process.env.__ZEALTEST_MISSING;
  assert.throws(() => getEnv('__ZEALTEST_MISSING'), (err) => {
    assert.match(err.message, /__ZEALTEST_MISSING/);
    return true;
  });
});

test('getEnv treats a blank/whitespace value as missing', () => {
  process.env.__ZEALTEST_BLANK = '   ';
  assert.throws(() => getEnv('__ZEALTEST_BLANK'), /__ZEALTEST_BLANK/);
  delete process.env.__ZEALTEST_BLANK;
});

test('validateServerEnv lists missing names only (no values)', () => {
  const saved = {};
  for (const n of Object.keys(SERVER_ENV)) { saved[n] = process.env[n]; delete process.env[n]; }
  process.env.SUPABASE_URL = 'https://example.supabase.co'; // one present, rest missing
  try {
    assert.throws(() => validateServerEnv(), (err) => {
      assert.match(err.message, /CHILD_JWT_SECRET/);
      assert.doesNotMatch(err.message, /https:\/\/example\.supabase\.co/); // never echoes a value
      assert.doesNotMatch(err.message, /SUPABASE_URL/); // present → not listed
      return true;
    });
  } finally {
    for (const n of Object.keys(SERVER_ENV)) {
      if (saved[n] === undefined) delete process.env[n]; else process.env[n] = saved[n];
    }
  }
});

test('.env.example exists with placeholders only (no real secret values)', () => {
  const example = readFileSync(new URL('../.env.example', import.meta.url), 'utf8');
  for (const name of Object.keys(SERVER_ENV)) {
    // each required var present as a bare `NAME=` placeholder (empty value)
    assert.match(example, new RegExp(`^${name}=\\s*$`, 'm'), `${name} should be an empty placeholder`);
  }
  // no real-looking secrets committed in the example
  assert.equal(/\bsk-[A-Za-z0-9]{20,}/.test(example), false);
  assert.equal(/\beyJ[A-Za-z0-9_-]{20,}/.test(example), false);
});
