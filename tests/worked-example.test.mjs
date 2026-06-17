// Regression lock for the worked-example escape hatch (roadmap A3 / T-03).
// The guard is what stops the model from doing the student's homework: it must demand a
// NEW, different parallel problem AND forbid solving the student's own submitted problem.
// Plus static checks that the client (public/app.html) is wired to request the feature.
// Pure string checks — run with no install, no network.
import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { getWorkedExampleGuard } from '../lib/prompts.js';

const app = readFileSync(new URL('../public/app.html', import.meta.url), 'utf8');

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

// ---- client wiring (public/app.html) ----

test('worked-example button exists, is labelled, and triggers the feature', () => {
  assert.match(app, /id="worked-example-btn"/, 'the button is present');
  assert.match(app, /onclick="sendMessage\(\{\s*workedExample:\s*true\s*\}\)"/,
    'button invokes sendMessage with the workedExample option');
  assert.match(app, /id="worked-example-btn"[^>]*aria-label=/, 'button has an accessible label');
});

test('sendMessage flags the request so the server applies the guard', () => {
  // The body must carry worked_example:true — that is what makes api/chat.js append the guard.
  assert.match(app, /body\.worked_example\s*=\s*true/,
    'sendMessage sets body.worked_example for the server');
});

test('sendMessage accepts an options arg without breaking existing callers', () => {
  // Default-param so the no-arg call sites (Enter key, Send button) keep working.
  assert.match(app, /function sendMessage\(\s*opts\s*=\s*\{\}\s*\)/);
});
