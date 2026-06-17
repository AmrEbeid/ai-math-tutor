// Regression lock for the worked-example escape hatch (roadmap A3 / T-03).
// The guard is what stops the model from doing the student's homework: it must demand a
// NEW, different parallel problem AND forbid solving the student's own submitted problem.
// Pure string function — runs with no install, no network.
import { test } from 'node:test';
import assert from 'node:assert';
import { getWorkedExampleGuard } from '../lib/prompts.js';

test('getWorkedExampleGuard returns a non-empty instruction string', () => {
  const g = getWorkedExampleGuard();
  assert.equal(typeof g, 'string');
  assert.ok(g.length > 0);
});

test('guard demands a NEW, different parallel problem', () => {
  const g = getWorkedExampleGuard().toLowerCase();
  assert.ok(g.includes('new'), 'must ask for a new problem');
  assert.ok(g.includes('different'), 'must require it be clearly different');
  assert.ok(g.includes('parallel') || g.includes('same type'), 'must be a parallel/same-type problem');
});

test('guard forbids solving the student\'s own submitted problem (anti-cheat)', () => {
  const g = getWorkedExampleGuard();
  assert.ok(/do not/i.test(g), 'must contain an explicit prohibition');
  assert.ok(/own/i.test(g), 'must reference the student\'s OWN problem');
  // The prohibition and the "own problem" reference must co-occur in one instruction,
  // so the guard can never be read as merely "demonstrate then also solve theirs".
  assert.ok(
    /(do not|never)[^.]*\bown\b/i.test(g) || /\bown\b[^.]*(do not|never|not)/i.test(g),
    'the prohibition must apply to the student\'s own problem'
  );
});

test('guard invites the student to try their own problem afterward', () => {
  const g = getWorkedExampleGuard().toLowerCase();
  assert.ok(g.includes('try'), 'must hand agency back to the student');
});
