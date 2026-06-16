// Server-side Server-Sent-Events (SSE) framing helpers for streaming chat replies.
//
// Wire format (one logical event per `data:` line, terminated by a blank line):
//   token delta : data: {"delta":"<text>"}\n\n
//   metadata    : data: {"credits_remaining":42,...}\n\n   (final turn info; no `delta`)
//   terminator  : data: [DONE]\n\n
//
// The client (public/js/stream.js) distinguishes them: an event with `delta` is a
// token to append; `[DONE]` ends the stream; anything else is the final metadata payload.
// JSON.stringify guarantees the delimiter (\n\n) can never appear unescaped inside a value.

export function formatSSE(delta, done = false) {
  if (done) return 'data: [DONE]\n\n';
  return `data: ${JSON.stringify({ delta })}\n\n`;
}

export function formatSSEEvent(obj) {
  return `data: ${JSON.stringify(obj)}\n\n`;
}
