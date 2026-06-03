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

test('child/parent pages do not leak a service-role-looking secret', () => {
  // The public anon key (eyJ...) is allowed; a service_role JWT or sk- key is not.
  for (const [name, html] of Object.entries(pages)) {
    assert.equal(/service_role/i.test(html), false, `${name}.html references service_role`);
    assert.equal(/\bsk-[A-Za-z0-9]{20,}/.test(html), false, `${name}.html contains an OpenAI-style secret`);
  }
});
