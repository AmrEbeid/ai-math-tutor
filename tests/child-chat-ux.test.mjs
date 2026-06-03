// Static smoke tests for the Stage 2 child tutor chat UX (public/app.html).
// Pure string checks — no browser, no network. Run: node --test tests/child-chat-ux.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const app = readFileSync(new URL('../public/app.html', import.meta.url), 'utf8');

test('chat log is accessible (aria-live region)', () => {
  assert.match(app, /id="chat-messages"[^>]*aria-live="polite"/);
  assert.match(app, /role="log"/);
});

test('input and send controls have accessible labels', () => {
  assert.match(app, /id="chat-input"[^>]*aria-label=/);
  assert.match(app, /id="send-btn"[^>]*aria-label=/);
});

test('tutor copy is hint-first / step-by-step', () => {
  assert.match(app, /hints? first|step by step/i);
});

test('low/no-credit state defers to the parent (no child payment)', () => {
  assert.match(app, /ask your parent/i);
});

test('child UI exposes NO payment/checkout surface', () => {
  assert.equal(/credits\/checkout|lemonsqueezy|buy now|pricing\.html/i.test(app), false);
});

test('session-expired state guides back to login', () => {
  assert.match(app, /session has timed out|log in again/i);
});

test('RTL/Arabic ready (dir toggled for Arabic)', () => {
  assert.match(app, /\.dir\s*=\s*currentLang === 'ar' \? 'rtl'/);
});

test('typing/loading and error states exist', () => {
  assert.match(app, /Thinking\.\.\./);
  assert.match(app, /something went wrong/i);
});

test('no server secret leaked in the child page', () => {
  assert.equal(/service_role/i.test(app), false);
  assert.equal(/\bsk-[A-Za-z0-9]{20,}/.test(app), false);
});
