// Tests for the safety-alert severity → channel config (lib/alerts.js).
// Locks the severity model the (gated) dispatchAlert seam will rely on. Pure — no install/network.
import { test } from 'node:test';
import assert from 'node:assert';
import { SEVERITY, ALERT_POLICY, alertPlanFor, needsSecondChannel, secondaryChannels } from '../lib/alerts.js';

test('severity model matches the safety-alerts design (§1)', () => {
  assert.equal(ALERT_POLICY.child_distress.severity, SEVERITY.HIGH);
  assert.equal(ALERT_POLICY.personal_info_shared.severity, SEVERITY.MEDIUM);
  assert.equal(ALERT_POLICY.stuck_loop.severity, SEVERITY.LOW);
});

test('in-app is always a channel (durable record never skipped)', () => {
  for (const type of Object.keys(ALERT_POLICY)) {
    assert.ok(ALERT_POLICY[type].channels.includes('in_app'), `${type} includes in_app`);
  }
  assert.ok(alertPlanFor('totally_unknown').channels.includes('in_app'));
});

test('only High severity (distress) warrants a second channel', () => {
  assert.equal(needsSecondChannel('child_distress'), true);
  assert.equal(needsSecondChannel('personal_info_shared'), false);
  assert.equal(needsSecondChannel('stuck_loop'), false);
});

test('distress routes to email + push beyond in-app; stuck is in-app only', () => {
  assert.deepEqual(secondaryChannels('child_distress'), ['email', 'push']);
  assert.deepEqual(secondaryChannels('stuck_loop'), []);
  assert.deepEqual(secondaryChannels('personal_info_shared'), ['email']);
});

test('an unknown type gets a safe Low / in-app-only default (never no channel)', () => {
  const p = alertPlanFor('something_new');
  assert.equal(p.severity, SEVERITY.LOW);
  assert.deepEqual([...p.channels], ['in_app']);
  assert.equal(needsSecondChannel('something_new'), false);
});

test('the policy and its entries are frozen (config is immutable)', () => {
  assert.ok(Object.isFrozen(ALERT_POLICY));
  for (const type of Object.keys(ALERT_POLICY)) {
    assert.ok(Object.isFrozen(ALERT_POLICY[type]));
    assert.ok(Object.isFrozen(ALERT_POLICY[type].channels));
  }
});
