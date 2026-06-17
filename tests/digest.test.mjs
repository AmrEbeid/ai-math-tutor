// Tests for the weekly-digest aggregation (lib/digest.js).
// Locks the privacy-safe aggregates + the idle-gap-capped time-on-task algorithm that the
// (gated) digest slice will rely on. Pure functions — no install, no network.
import { test } from 'node:test';
import assert from 'node:assert';
import { timeOnTaskMinutes, summarizeWeek, IDLE_GAP_CAP_MINUTES, DIGEST_FLAG_TYPES } from '../lib/digest.js';

const MIN = 60000; // ms per minute
const base = 1_700_000_000_000; // fixed epoch ms; tests must not call Date.now()
const at = (mins) => base + mins * MIN;

// ---- timeOnTaskMinutes ----

test('fewer than two timestamps means zero time on task', () => {
  assert.equal(timeOnTaskMinutes([]), 0);
  assert.equal(timeOnTaskMinutes([at(0)]), 0);
});

test('sums consecutive gaps for a normal session', () => {
  // messages at 0, 2, 5 minutes -> 2 + 3 = 5 minutes
  assert.equal(timeOnTaskMinutes([at(0), at(2), at(5)]), 5);
});

test('caps long idle gaps at IDLE_GAP_CAP_MINUTES', () => {
  // 0 then 90 minutes later -> a single 90-min gap capped to 10
  assert.equal(timeOnTaskMinutes([at(0), at(90)]), IDLE_GAP_CAP_MINUTES);
  // 0, 3, then 120 later -> 3 + capped(10) = 13
  assert.equal(timeOnTaskMinutes([at(0), at(3), at(123)]), 3 + IDLE_GAP_CAP_MINUTES);
});

test('accepts ISO strings and unsorted input', () => {
  const iso = (m) => new Date(at(m)).toISOString();
  assert.equal(timeOnTaskMinutes([iso(5), iso(0), iso(2)]), 5);
});

test('ignores unparseable timestamps', () => {
  assert.equal(timeOnTaskMinutes([at(0), 'not-a-date', at(4)]), 4);
});

test('a custom idle cap is honored', () => {
  assert.equal(timeOnTaskMinutes([at(0), at(90)], { idleGapCapMinutes: 20 }), 20);
});

// ---- summarizeWeek ----

test('aggregates sessions, questions, subjects, topics, and time across sessions', () => {
  const r = summarizeWeek({
    sessions: [
      { id: 's1', subject: 'math', topic: 'fractions' },
      { id: 's2', subject: 'science', topic: 'plants' },
      { id: 's3', subject: 'math', topic: 'fractions' }, // dup subject + topic
    ],
    messages: [
      { session_id: 's1', role: 'user', created_at: at(0) },
      { session_id: 's1', role: 'assistant', created_at: at(2) },
      { session_id: 's1', role: 'user', created_at: at(4) },
      { session_id: 's2', role: 'user', created_at: at(0) },
      { session_id: 's2', role: 'assistant', created_at: at(3) },
    ],
    notifications: [],
  });
  assert.equal(r.sessions, 3);
  assert.equal(r.questions, 3, 'user messages only');
  assert.deepEqual(r.subjects.sort(), ['math', 'science']);
  assert.deepEqual(r.topics.sort(), ['fractions', 'plants']);
  assert.equal(r.timeOnTaskMinutes, 4 + 3, 's1 (0->2->4)=4 plus s2 (0->3)=3');
});

test('counts each safety-flag type and the total', () => {
  const r = summarizeWeek({
    sessions: [{ id: 's1', subject: 'math' }],
    messages: [],
    notifications: [
      { type: 'child_distress' },
      { type: 'stuck_loop' },
      { type: 'stuck_loop' },
      { type: 'credits_low' }, // not a digest flag type — ignored
    ],
  });
  assert.equal(r.safetyFlags.child_distress, 1);
  assert.equal(r.safetyFlags.stuck_loop, 2);
  assert.equal(r.safetyFlags.personal_info_shared, 0);
  assert.equal(r.safetyFlagTotal, 3);
});

test('empty input yields a zeroed but well-formed summary', () => {
  const r = summarizeWeek();
  assert.deepEqual(r, {
    sessions: 0, questions: 0, timeOnTaskMinutes: 0,
    subjects: [], topics: [],
    safetyFlags: { child_distress: 0, personal_info_shared: 0, stuck_loop: 0 },
    safetyFlagTotal: 0,
  });
});

test('the summary never includes message content or names (privacy)', () => {
  const r = summarizeWeek({
    sessions: [{ id: 's1', subject: 'math', topic: 'x', child_name: 'Sara' }],
    messages: [{ session_id: 's1', role: 'user', created_at: at(0), content: 'my secret' }],
    notifications: [],
  });
  const json = JSON.stringify(r);
  assert.ok(!json.includes('secret'), 'no message content');
  assert.ok(!json.includes('Sara'), 'no child name');
});

test('DIGEST_FLAG_TYPES is the frozen safety set', () => {
  assert.deepEqual([...DIGEST_FLAG_TYPES], ['child_distress', 'personal_info_shared', 'stuck_loop']);
  assert.ok(Object.isFrozen(DIGEST_FLAG_TYPES));
});
