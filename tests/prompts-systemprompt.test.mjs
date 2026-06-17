// Coverage for getSystemPrompt's non-age dimensions: subject selection, country/ISO →
// curriculum resolution, sub-subject focus, and safe defaults. The age-band dimension is
// covered separately in prompts-ageband.test.mjs; this locks the rest of the prompt builder
// so a future edit can't silently drop the curriculum, subject framing, or safety rules.
// Pure function — no install, no network.
import { test } from 'node:test';
import assert from 'node:assert';
import { getSystemPrompt, COUNTRY_CODE_MAP, CHILD_SAFETY } from '../lib/prompts.js';

// ---- subject selection ----

test('subject sets the label and tutor topic line', () => {
  assert.match(getSystemPrompt(5, 'en', 'UAE', 'math'), /SUBJECT: Math/);
  assert.match(getSystemPrompt(5, 'en', 'UAE', 'math'), /math tutor/);

  const sci = getSystemPrompt(5, 'en', 'UAE', 'science');
  assert.match(sci, /SUBJECT: Science/);
  assert.match(sci, /science tutor/);

  const eng = getSystemPrompt(5, 'en', 'UAE', 'english');
  assert.match(eng, /SUBJECT: English/);
  assert.match(eng, /English language tutor/);
});

test('an unknown subject falls back to math framing', () => {
  const p = getSystemPrompt(5, 'en', 'UAE', 'astrology');
  // subjectLabel only maps math/science/english → anything else renders as "English"
  // label-wise, but the RULES default to math; assert the math tutor topic line is used.
  assert.match(p, /math tutor/, 'unknown subject uses the math rule set');
});

// ---- country / ISO → curriculum resolution ----

test('ISO country codes resolve to the right curriculum', () => {
  const ae = getSystemPrompt(5, 'en', 'AE');
  assert.match(ae, /UAE Ministry of Education Curriculum/);
  assert.match(ae, /UAE curriculum standards/);

  assert.match(getSystemPrompt(5, 'en', 'SA'), /Saudi National Mathematics Curriculum/);
  assert.match(getSystemPrompt(5, 'en', 'EG'), /Egyptian General Framework/);
});

test('full country names also work (not just ISO codes)', () => {
  assert.match(getSystemPrompt(5, 'en', 'Saudi Arabia'), /Saudi National Mathematics Curriculum/);
});

test('an unknown country defaults to the UAE curriculum (safe default)', () => {
  assert.match(getSystemPrompt(5, 'en', 'Atlantis'), /UAE Ministry of Education Curriculum/);
});

test('COUNTRY_CODE_MAP covers the GCC + key MENA markets', () => {
  for (const iso of ['AE', 'SA', 'QA', 'KW', 'BH', 'OM', 'EG']) {
    assert.ok(COUNTRY_CODE_MAP[iso], `ISO ${iso} maps to a country`);
  }
});

// ---- sub-subject focus ----

test('a sub-subject injects a focus-area constraint; absence omits it', () => {
  assert.match(getSystemPrompt(5, 'en', 'UAE', 'science', 'Biology'),
    /FOCUS AREA: Biology \(stay within this sub-subject\)/);
  assert.doesNotMatch(getSystemPrompt(5, 'en', 'UAE', 'science'), /FOCUS AREA:/);
});

// ---- always-present safety rules + curriculum scaffolding ----

test('the non-negotiable child-safety rules are always injected', () => {
  const anchor = CHILD_SAFETY.coreRules.split('\n').find(l => l.trim().length > 10).trim();
  for (const subj of ['math', 'science', 'english']) {
    assert.ok(getSystemPrompt(5, 'en', 'UAE', subj).includes(anchor),
      `safety core rules present for ${subj}`);
  }
});

test('curriculum scaffolding sections are present', () => {
  const p = getSystemPrompt(5, 'en', 'UAE');
  for (const section of [/CURRICULUM:/, /TEACHING METHOD:/, /GRADE STRUCTURE:/, /LOCAL CONTEXT:/]) {
    assert.match(p, section);
  }
});
