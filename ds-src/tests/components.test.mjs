// Class-name contract tests for the Zeluu design-system components.
// The components are thin wrappers whose VALUE is emitting the product's real
// CSS class names — these tests lock that contract so an edit can't silently
// change what gets synced to Claude Design. Renders the BUILT dist via
// react-dom/server (no JSX compile, no extra deps).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// Import each component from its own dist file (.js explicit). The barrel
// (dist/index.js) re-exports extensionlessly — fine for the esbuild bundle the
// converter builds, but native Node ESM needs the per-file .js paths used here.
import { Button } from '../dist/Button.js';
import { NavBar } from '../dist/NavBar.js';
import { LiveBadge } from '../dist/LiveBadge.js';
import { Card } from '../dist/Card.js';
import { Feature } from '../dist/Feature.js';
import { Step } from '../dist/Step.js';
import { Stat } from '../dist/Stat.js';
import { StatCard } from '../dist/StatCard.js';
import { PlanCard } from '../dist/PlanCard.js';
import { FormField } from '../dist/FormField.js';
import { Modal } from '../dist/Modal.js';
import { Spinner } from '../dist/Spinner.js';
import { CreditBadge } from '../dist/CreditBadge.js';
import { InfoCell } from '../dist/InfoCell.js';
import { SubjectTab } from '../dist/SubjectTab.js';
import { TopicTag } from '../dist/TopicTag.js';
import { ChatBubble } from '../dist/ChatBubble.js';
import { Container } from '../dist/Container.js';
import { Toggle } from '../dist/Toggle.js';
const DS = { Button, NavBar, LiveBadge, Card, Feature, Step, Stat, StatCard, PlanCard, FormField, Modal, Spinner, CreditBadge, InfoCell, SubjectTab, TopicTag, ChatBubble, Container, Toggle };

const html = (el) => renderToStaticMarkup(el);
const has = (markup, ...cls) => cls.every((c) => new RegExp(`class="[^"]*\\b${c}\\b`).test(markup));

test('Button: variants, sizes, link/disabled', () => {
  assert.ok(has(html(h(DS.Button, null, 'Go')), 'btn', 'btn-primary'));
  assert.ok(has(html(h(DS.Button, { variant: 'secondary' }, 'Go')), 'btn-secondary'));
  assert.ok(has(html(h(DS.Button, { variant: 'white' }, 'Go')), 'btn-white'));
  assert.ok(has(html(h(DS.Button, { size: 'sm' }, 'Go')), 'btn-sm'));
  assert.ok(has(html(h(DS.Button, { size: 'large' }, 'Go')), 'btn-large'));
  const link = html(h(DS.Button, { href: '/x' }, 'Go'));
  assert.match(link, /^<a /, 'href renders an anchor');
  assert.match(link, /href="\/x"/);
  const disabled = html(h(DS.Button, { disabled: true }, 'Go'));
  assert.match(disabled, /^<button/);
  assert.match(disabled, /disabled/);
});

test('NavBar: sticky nav with brand', () => {
  const m = html(h(DS.NavBar, { brand: 'Zeluu' }));
  assert.ok(has(m, 'nav', 'nav-inner', 'nav-brand'));
  assert.match(m, /Zeluu/);
});

test('LiveBadge: pill + optional pulse dot', () => {
  assert.ok(has(html(h(DS.LiveBadge, null, 'Live')), 'hero-badge', 'pulse-dot'));
  assert.ok(!has(html(h(DS.LiveBadge, { dot: false }, 'Live')), 'pulse-dot'));
});

test('Card: surface + optional header', () => {
  assert.ok(has(html(h(DS.Card, null, 'body')), 'card'));
  assert.ok(has(html(h(DS.Card, { header: 'H' }, 'body')), 'card-header'));
});

test('Feature / Step: marketing rows', () => {
  assert.ok(has(html(h(DS.Feature, { icon: 'x', title: 'T' }, 'd')), 'feature', 'feature-icon'));
  assert.ok(has(html(h(DS.Step, { number: 1, title: 'T' }, 'd')), 'step', 'step-num'));
});

test('Stat / StatCard: numbers', () => {
  assert.ok(has(html(h(DS.Stat, { value: '1', label: 'L' })), 'stat', 'stat-num', 'stat-text'));
  assert.ok(has(html(h(DS.StatCard, { value: '1', label: 'L' })), 'stat-card', 'stat-value', 'stat-label'));
});

test('PlanCard: price, features, featured', () => {
  const m = html(h(DS.PlanCard, { name: 'Solo', price: '9', features: ['a', 'b'] }));
  assert.ok(has(m, 'plan-card', 'plan-price', 'plan-btn'));
  assert.equal((m.match(/<li/g) || []).length, 2, 'one li per feature');
  assert.ok(has(html(h(DS.PlanCard, { name: 'F', price: '9', featured: true })), 'featured'));
});

test('FormField: group, label, input, error', () => {
  const base = html(h(DS.FormField, { label: 'Email', name: 'e' }));
  assert.ok(has(base, 'form-group'));
  assert.match(base, /<label/);
  assert.match(base, /<input/);
  assert.ok(!has(base, 'form-error'));
  assert.ok(has(html(h(DS.FormField, { label: 'Email', error: 'bad' })), 'form-error'));
});

test('Modal: overlay, dialog, title, close', () => {
  const m = html(h(DS.Modal, { title: 'T' }, 'body'));
  assert.ok(has(m, 'modal-overlay', 'modal', 'modal-close'));
  assert.match(m, /<h2[^>]*>T/);
  assert.ok(!has(html(h(DS.Modal, { title: 'T', closable: false }, 'b')), 'modal-close'));
});

test('Spinner', () => {
  assert.ok(has(html(h(DS.Spinner)), 'spinner'));
});

test('CreditBadge: level axis', () => {
  assert.ok(has(html(h(DS.CreditBadge, null, '1')), 'credit-badge'));
  assert.ok(has(html(h(DS.CreditBadge, { level: 'low' }, '1')), 'low'));
  assert.ok(has(html(h(DS.CreditBadge, { level: 'empty' }, '1')), 'empty'));
  assert.ok(!has(html(h(DS.CreditBadge, { level: 'normal' }, '1')), 'low'));
});

test('InfoCell', () => {
  assert.ok(has(html(h(DS.InfoCell, { label: 'L', value: 'V' })), 'info-cell', 'info-cell-label', 'info-cell-value'));
});

test('SubjectTab: active + icon', () => {
  assert.ok(has(html(h(DS.SubjectTab, { label: 'Math', icon: 'm', active: true })), 'subject-tab', 'active', 'tab-icon'));
  assert.ok(!has(html(h(DS.SubjectTab, { label: 'Math' })), 'active'));
});

test('TopicTag', () => {
  assert.ok(has(html(h(DS.TopicTag, null, 'Fractions')), 'topic-tag'));
});

test('ChatBubble: role', () => {
  assert.ok(has(html(h(DS.ChatBubble, { role: 'user' }, 'hi')), 'chat-bubble', 'user'));
  assert.ok(has(html(h(DS.ChatBubble, { role: 'assistant' }, 'hi')), 'chat-bubble', 'assistant'));
});

test('Container', () => {
  assert.ok(has(html(h(DS.Container, null, 'x')), 'container'));
});

test('Toggle: segmented control, active + badge', () => {
  const opts = [{ value: 'm', label: 'Monthly' }, { value: 'a', label: 'Annual', badge: 'Save 20%' }];
  const m = html(h(DS.Toggle, { value: 'a', options: opts }));
  assert.ok(has(m, 'toggle-pill'));
  assert.equal((m.match(/<button/g) || []).length, 2, 'one button per option');
  assert.match(m, /class="active"[^>]*aria-pressed="true"[^>]*>Annual/);
  assert.ok(has(m, 'save-badge'));
});

test('all 19 components are exported', () => {
  const expected = ['Button','NavBar','LiveBadge','Card','Feature','Step','Stat','StatCard','PlanCard','FormField','Modal','Spinner','CreditBadge','InfoCell','SubjectTab','TopicTag','ChatBubble','Container','Toggle'];
  for (const name of expected) assert.equal(typeof DS[name], 'function', `${name} exported`);
});
