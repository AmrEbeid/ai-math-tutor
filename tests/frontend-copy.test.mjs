// Static copy-invariant smoke tests for the A0.5 trial/onboarding pages.
// Pure string checks on the HTML — no browser, no network. Run: node --test tests/frontend-copy.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (rel) => readFileSync(new URL(`../public/${rel}`, import.meta.url), 'utf8');
const pages = {
  index: read('index.html'),
  pricing: read('pricing.html'),
  login: read('login.html'),
  dashboard: read('dashboard.html'),
  safety: read('safety.html'),
};

const CONTRADICTIONS = /no (credit )?card required|no payment information is required/i;

test('no page advertises a no-card trial', () => {
  for (const [name, html] of Object.entries(pages)) {
    assert.equal(CONTRADICTIONS.test(html), false, `${name}.html still contains a no-card contradiction`);
  }
});

test('landing (index) states card-required 14-day trial with 10 free credits', () => {
  assert.match(pages.index, /card required/i);
  assert.match(pages.index, /14[- ]day/i);
  assert.match(pages.index, /10 free credits/i);
  assert.match(pages.index, /no charge today/i);
});

test('pricing states card-required 14-day trial with credits and no charge today', () => {
  assert.match(pages.pricing, /card required/i);
  assert.match(pages.pricing, /14[- ]day/i);
  assert.match(pages.pricing, /10 (free )?credits/i);
  assert.match(pages.pricing, /no charge today/i);
});

test('login signup flow mentions card + 14-day window', () => {
  assert.match(pages.login, /card/i);
  assert.match(pages.login, /14[- ]day/i);
});

test('dashboard shows a post-checkout activation/waiting state', () => {
  assert.match(pages.dashboard, /activating your trial/i);
});

test('safety page has the accessibility baseline (main landmark + skip link)', () => {
  assert.match(pages.safety, /class="skip-link"/);
  assert.match(pages.safety, /id="main"/);
  assert.match(pages.safety, /<title>Safety/i);
});

test('safety page states the core implemented safety claims', () => {
  // Hint-first pedagogy, the layered chat protections, and data isolation are LIVE.
  assert.match(pages.safety, /guide children to the answer/i);
  assert.match(pages.safety, /distress detection/i);
  assert.match(pages.safety, /personal-information detection/i);
  assert.match(pages.safety, /at the database level/i);
});

test('safety page references COPPA and the UK Children\'s Code', () => {
  assert.match(pages.safety, /COPPA/);
  assert.match(pages.safety, /Children's Code|Age-Appropriate Design Code/i);
});

test('safety page does not over-promise: digest/email alerts are marked not-yet-available', () => {
  // Weekly digest + instant email alerts are planned, not built — must be flagged "coming soon",
  // and consent is "in review" (no absolute compliance guarantee).
  assert.match(pages.safety, /badge-soon/);
  assert.match(pages.safety, /Coming soon/i);
  assert.match(pages.safety, /finalized with legal review/i);
});

test('safety page is linked from the public landing footer', () => {
  assert.match(pages.index, /href="\/safety\.html"/);
});

test('child/parent pages do not leak a service-role-looking secret', () => {
  // The public anon key (eyJ...) is allowed; a service_role JWT or sk- key is not.
  for (const [name, html] of Object.entries(pages)) {
    assert.equal(/service_role/i.test(html), false, `${name}.html references service_role`);
    assert.equal(/\bsk-[A-Za-z0-9]{20,}/.test(html), false, `${name}.html contains an OpenAI-style secret`);
  }
});
