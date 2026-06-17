// Tests for the plan/package catalog (lib/plans.js).
// Source of truth for the (not-yet-wired) plan grants + caps. Locks the numbers against the
// pricing design so a future gated cutover can rely on them. Pure data — no install, no network.
import { test } from 'node:test';
import assert from 'node:assert';
import { PLANS, getPlan, listActivePlans, isActivePlan, resolvePlanKey } from '../lib/plans.js';

test('catalog numbers match the pricing design (SPEC-PRICING §4 / impl §3)', () => {
  assert.deepEqual(
    Object.fromEntries(Object.values(PLANS).map(p => [p.key, [p.credits, p.dailyCap, p.maxChildren, p.voice]])),
    {
      free_trial: [50, 10, 1, false],
      family: [600, 20, 2, false],
      family_premium: [1500, 30, 4, true],
      student_plus: [1000, 40, 1, true],
      school_pilot: [null, null, null, null],
    }
  );
});

test('the trial is a 7-day total; paid plans are monthly', () => {
  assert.equal(PLANS.free_trial.period, 'trial');
  assert.equal(PLANS.free_trial.trialDays, 7);
  assert.equal(PLANS.family.period, 'month');
  assert.equal(PLANS.family_premium.period, 'month');
});

test('only trial + the two family plans are active in the first slice', () => {
  assert.deepEqual(listActivePlans().map(p => p.key).sort(), ['family', 'family_premium', 'free_trial']);
  assert.equal(isActivePlan('family'), true);
  assert.equal(isActivePlan('student_plus'), false, 'Student Plus is later/optional');
  assert.equal(isActivePlan('school_pilot'), false, 'School pilot is deferred');
});

test('the catalog and every plan are frozen (config is immutable at runtime)', () => {
  assert.ok(Object.isFrozen(PLANS));
  for (const p of Object.values(PLANS)) assert.ok(Object.isFrozen(p), `${p.key} is frozen`);
});

test('active plans have fully-scoped numbers; deferred school pilot is intentionally null', () => {
  for (const p of listActivePlans()) {
    for (const field of ['credits', 'dailyCap', 'maxChildren']) {
      assert.ok(Number.isInteger(p[field]) && p[field] >= 0, `${p.key}.${field} is a scoped non-negative integer`);
    }
  }
  assert.equal(PLANS.school_pilot.credits, null, 'school pilot numbers are TBD until scoped');
});

test('getPlan returns the plan or null for unknown keys', () => {
  assert.equal(getPlan('family').label, 'Family');
  assert.equal(getPlan('nope'), null);
  // must not be fooled by inherited Object props
  assert.equal(getPlan('toString'), null);
});

test('resolvePlanKey normalizes free-form names and rejects unknowns', () => {
  assert.equal(resolvePlanKey('family'), 'family');
  assert.equal(resolvePlanKey('Family Premium'), 'family_premium');
  assert.equal(resolvePlanKey('  free-trial '), 'free_trial');
  assert.equal(resolvePlanKey('enterprise'), null, 'unknown → null, no default assumed');
  assert.equal(resolvePlanKey(undefined), null);
  assert.equal(resolvePlanKey(42), null);
});
