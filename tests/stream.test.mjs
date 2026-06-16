// Tests for the client-side SSE buffer parser (public/js/stream.js).
// Pure function — exercises the incremental-decode logic the browser relies on,
// with no browser or network needed.
import { test } from 'node:test';
import assert from 'node:assert';
import { parseSSEBuffer } from '../public/js/stream.js';

test('extracts a complete event and keeps the incomplete remainder', () => {
  const { events, rest } = parseSSEBuffer('data: {"delta":"hi"}\n\ndata: {"delta":"the');
  assert.deepEqual(events, [{ delta: 'hi' }]);
  assert.equal(rest, 'data: {"delta":"the');
});

test('parses multiple complete events in one chunk', () => {
  const { events } = parseSSEBuffer('data: {"delta":"a"}\n\ndata: {"delta":"b"}\n\n');
  assert.deepEqual(events, [{ delta: 'a' }, { delta: 'b' }]);
});

test('recognizes the [DONE] terminator as a done event', () => {
  const { events } = parseSSEBuffer('data: [DONE]\n\n');
  assert.deepEqual(events, [{ done: true }]);
});

test('parses a final metadata event', () => {
  const { events } = parseSSEBuffer('data: {"credits_remaining":5,"is_stuck":false}\n\n');
  assert.deepEqual(events, [{ credits_remaining: 5, is_stuck: false }]);
});

test('skips malformed JSON without throwing and continues', () => {
  const { events } = parseSSEBuffer('data: {not json}\n\ndata: {"delta":"ok"}\n\n');
  assert.deepEqual(events, [{ delta: 'ok' }]);
});

test('ignores non-data lines (comments / blank keep-alives)', () => {
  const { events, rest } = parseSSEBuffer(': keep-alive\n\n');
  assert.deepEqual(events, []);
  assert.equal(rest, '');
});
