// Client-side SSE buffer parser for streaming tutor replies (pairs with lib/sse.js).
//
// Network reads arrive in arbitrary chunks that split events anywhere, so the caller
// accumulates text and feeds the running buffer here. We return every COMPLETE event
// (delimited by a blank line) plus the leftover `rest` to prepend to the next chunk.
//
// Event shapes returned:
//   { delta: '<text>' }                 — a token to append to the assistant bubble
//   { done: true }                      — the [DONE] terminator; stop reading
//   { credits_remaining, is_stuck, ... }— final turn metadata
//
// Malformed `data:` payloads and non-data lines (`:` keep-alive comments) are skipped,
// never thrown — a single bad frame must not break an in-flight reply.
export function parseSSEBuffer(buffer) {
  const segments = String(buffer).split('\n\n');
  const rest = segments.pop() ?? '';
  const events = [];
  for (const segment of segments) {
    const dataLine = segment.split('\n').find(line => line.startsWith('data:'));
    if (!dataLine) continue;
    const payload = dataLine.slice(5).trim();
    if (payload === '[DONE]') { events.push({ done: true }); continue; }
    try {
      events.push(JSON.parse(payload));
    } catch {
      // Skip a partial/garbled frame rather than aborting the stream.
    }
  }
  return { events, rest };
}
