// Tests for lib/env.js server env validation + the .env.example contract.
// No secrets used; asserts errors never contain values. Run: node --test tests/env.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getEnv, validateServerEnv, getAllowedOrigin, SERVER_ENV } from '../lib/env.js';

const REQUIRED = [
  'ALLOWED_ORIGIN', 'CHILD_JWT_SECRET', 'LEMONSQUEEZY_API_KEY', 'LEMONSQUEEZY_WEBHOOK_SECRET',
  'OPENAI_API_KEY', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_URL',
];

test('all 8 required server env vars are declared in the contract', () => {
  const declared = Object.keys(SERVER_ENV).filter((n) => SERVER_ENV[n].required).sort();
  assert.deepEqual(declared, [...REQUIRED].sort());
});

test('each of the 8 required vars fails secret-free via getEnv when blank', () => {
  for (const name of REQUIRED) {
    const saved = process.env[name];
    process.env[name] = '   '; // blank → must be treated as missing
    try {
      assert.throws(() => getEnv(name), (err) => {
        assert.match(err.message, new RegExp(name));      // names the var
        assert.doesNotMatch(err.message, /\bsk-|eyJ/);    // never an API-key/JWT-shaped value
        return true;
      }, `${name} should fail via getEnv when blank`);
    } finally {
      if (saved === undefined) delete process.env[name]; else process.env[name] = saved;
    }
  }
});

test('getAllowedOrigin returns the configured value, else the documented "*" fallback', () => {
  const saved = process.env.ALLOWED_ORIGIN;
  process.env.ALLOWED_ORIGIN = 'https://zeluu.com';
  assert.equal(getAllowedOrigin(), 'https://zeluu.com');
  delete process.env.ALLOWED_ORIGIN;
  assert.equal(getAllowedOrigin(), '*');           // explicit, documented fallback (never throws)
  process.env.ALLOWED_ORIGIN = '   ';
  assert.equal(getAllowedOrigin(), '*');           // blank also falls back
  if (saved === undefined) delete process.env.ALLOWED_ORIGIN; else process.env.ALLOWED_ORIGIN = saved;
});

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
