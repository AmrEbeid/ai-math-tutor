// Regression lock for the age-banded tutor tone (G1-3 / 4-6 / 7-9).
// Verifies getSystemPrompt selects the correct developmental band by grade and
// injects its tone / session-wellbeing / autonomy guidance into the system prompt.
// This LOCKS existing behavior (no redesign) so future edits can't silently drop
// or mis-map the age bands. See lib/prompts.js CHILD_SAFETY.ageBands.
import { test } from 'node:test';
import assert from 'node:assert';
import { getSystemPrompt } from '../lib/prompts.js';

// Distinctive substrings taken verbatim from each band's tone/sessionLength.
const LOWER_TONE = 'Very warm, playful';
const MIDDLE_TONE = 'slightly more mature';
const UPPER_TONE = 'treat them as a young learner';

test('getSystemPrompt returns a non-empty string with age-tone section', () => {
  const p = getSystemPrompt(5);
  assert.equal(typeof p, 'string');
  assert.ok(p.length > 0);
  assert.ok(p.includes('AGE-APPROPRIATE TONE'), 'must inject the age-tone section');
});

test('lower band (grades 1-3) gets the playful/simple tone + 15-min break', () => {
  for (const g of [1, 2, 3]) {
    const p = getSystemPrompt(g);
    assert.ok(p.includes(LOWER_TONE), `grade ${g} should use the lower-band tone`);
    assert.ok(p.includes('15 minutes'), `grade ${g} should use the lower-band session length`);
    assert.ok(!p.includes(MIDDLE_TONE) && !p.includes(UPPER_TONE), `grade ${g} should not leak other bands`);
  }
});

test('middle band (grades 4-6) gets the more-mature tone + 25-min break', () => {
  for (const g of [4, 5, 6]) {
    const p = getSystemPrompt(g);
    assert.ok(p.includes(MIDDLE_TONE), `grade ${g} should use the middle-band tone`);
    assert.ok(p.includes('25 minutes'), `grade ${g} should use the middle-band session length`);
    assert.ok(!p.includes(LOWER_TONE) && !p.includes(UPPER_TONE), `grade ${g} should not leak other bands`);
  }
});

test('upper band (grades 7-9) gets the respectful tone + 30-min break', () => {
  for (const g of [7, 8, 9]) {
    const p = getSystemPrompt(g);
    assert.ok(p.includes(UPPER_TONE), `grade ${g} should use the upper-band tone`);
    assert.ok(p.includes('30 minutes'), `grade ${g} should use the upper-band session length`);
    assert.ok(!p.includes(LOWER_TONE) && !p.includes(MIDDLE_TONE), `grade ${g} should not leak other bands`);
  }
});

test('band boundaries map correctly (3->lower, 4->middle, 6->middle, 7->upper)', () => {
  assert.ok(getSystemPrompt(3).includes(LOWER_TONE));
  assert.ok(getSystemPrompt(4).includes(MIDDLE_TONE));
  assert.ok(getSystemPrompt(6).includes(MIDDLE_TONE));
  assert.ok(getSystemPrompt(7).includes(UPPER_TONE));
});

test('out-of-range grade falls back to the upper band (safe default)', () => {
  // Grades outside 1-9 are not an MVP target; document the current safe fallback.
  assert.ok(getSystemPrompt(12).includes(UPPER_TONE), 'grade 12 falls back to upper band');
});

test('age band is consistent across subjects (math/science/english)', () => {
  for (const subject of ['math', 'science', 'english']) {
    assert.ok(getSystemPrompt(2, 'en', 'UAE', subject).includes(LOWER_TONE), `${subject} grade 2 -> lower`);
    assert.ok(getSystemPrompt(8, 'en', 'UAE', subject).includes(UPPER_TONE), `${subject} grade 8 -> upper`);
  }
});
