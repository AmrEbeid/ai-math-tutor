// Tests for the per-action credit cost config (lib/credits.js).
// This module is the source of truth for the (not-yet-wired) per-action metering migration;
// these tests lock the cost table + the server-side turn-cost derivation so the future gated
// cutover can rely on them. Pure functions — no install, no network.
import { test } from 'node:test';
import assert from 'node:assert';
import {
  ACTION_CREDIT_COSTS,
  DEFAULT_ACTION_COST,
  creditCostForAction,
  creditCostForTurn,
} from '../lib/credits.js';

test('cost table matches the pricing design (SPEC-SLICE-pricing-credits-impl §2)', () => {
  assert.deepEqual({ ...ACTION_CREDIT_COSTS }, {
    text_exchange: 1,
    image_solve: 3,
    voice_exchange: 2,
    practice_set: 2,
    quiz_gen: 2,
    mistake_report: 1,
    weekly_plan: 0,
    reread_cached: 0,
  });
});

test('every cost is a non-negative integer', () => {
  for (const [action, cost] of Object.entries(ACTION_CREDIT_COSTS)) {
    assert.ok(Number.isInteger(cost) && cost >= 0, `${action} cost must be a non-negative integer`);
  }
});

test('the cost table is frozen (config cannot be mutated at runtime)', () => {
  assert.ok(Object.isFrozen(ACTION_CREDIT_COSTS));
  assert.throws(() => { 'use strict'; ACTION_CREDIT_COSTS.text_exchange = 99; });
});

test('zero-cost actions stay free (no generation)', () => {
  assert.equal(creditCostForAction('weekly_plan'), 0);
  assert.equal(creditCostForAction('reread_cached'), 0);
});

test('creditCostForAction returns the mapped cost for known actions', () => {
  assert.equal(creditCostForAction('text_exchange'), 1);
  assert.equal(creditCostForAction('image_solve'), 3);
  assert.equal(creditCostForAction('voice_exchange'), 2);
});

test('an unknown action falls back to the safe default (never free, never wild)', () => {
  assert.equal(creditCostForAction('totally_made_up'), DEFAULT_ACTION_COST);
  assert.equal(DEFAULT_ACTION_COST, 1);
});

test('creditCostForTurn derives cost from the request shape (image vs text)', () => {
  assert.equal(creditCostForTurn({ image: 'data:image/png;base64,...' }), 3, 'image turn = image_solve');
  assert.equal(creditCostForTurn({ image: null }), 1, 'no image = text_exchange');
  assert.equal(creditCostForTurn({}), 1, 'missing image field = text_exchange');
  assert.equal(creditCostForTurn(), 1, 'no body at all = text_exchange (safe)');
});
