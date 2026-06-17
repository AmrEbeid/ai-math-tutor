// Tests for the server-side SSE framing helpers (lib/sse.js).
// Pure string functions — run with no install, no network.
import { test } from 'node:test';
import assert from 'node:assert';
import { formatSSE, formatSSEEvent } from '../lib/sse.js';

test('formatSSE frames a token delta as an SSE data line', () => {
  assert.equal(formatSSE('hi'), 'data: {"delta":"hi"}\n\n');
});

test('formatSSE escapes special characters via JSON encoding', () => {
  assert.equal(formatSSE('a\n"b"'), 'data: {"delta":"a\\n\\"b\\""}\n\n');
});

test('formatSSE frames the [DONE] terminator', () => {
  assert.equal(formatSSE(null, true), 'data: [DONE]\n\n');
});

test('formatSSEEvent frames an arbitrary metadata object', () => {
  assert.equal(
    formatSSEEvent({ credits_remaining: 42, is_stuck: false }),
    'data: {"credits_remaining":42,"is_stuck":false}\n\n'
  );
});
