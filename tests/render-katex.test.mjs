// Tests for the shared, XSS-safe, math-aware renderer (public/js/render.js).
// KaTeX is INJECTED (a stub or null) so these run with no install / no browser.
import { test } from 'node:test';
import assert from 'node:assert';
import { renderMarkdown, escapeHtml } from '../public/js/render.js';

// Minimal KaTeX stub: echoes a marker so we can assert the math path was taken,
// without depending on the real library.
const katexStub = {
  renderToString(tex, opts) {
    return `<span class="katex" data-display="${opts.displayMode}">KX:${tex}</span>`;
  },
};

test('escapeHtml escapes the dangerous characters', () => {
  assert.equal(escapeHtml('<a href="x">&\'</a>'), '&lt;a href=&quot;x&quot;&gt;&amp;&#039;&lt;/a&gt;');
});

test('prose with HTML is escaped (no injection)', () => {
  const out = renderMarkdown('<img src=x onerror=alert(1)>', katexStub);
  assert.ok(!out.includes('<img'), 'raw tag must be escaped');
  assert.ok(out.includes('&lt;img'), 'escaped form expected');
});

test('inline $...$ is rendered via KaTeX', () => {
  const out = renderMarkdown('Solve $x^2$ now', katexStub);
  assert.ok(out.includes('class="katex"'), 'KaTeX markup expected');
  assert.ok(out.includes('KX:x^2'), 'the LaTeX should reach KaTeX');
  assert.ok(out.includes('Solve ') && out.includes(' now'), 'surrounding prose preserved');
});

test('display $$...$$ uses displayMode', () => {
  const out = renderMarkdown('$$\\frac{1}{2}$$', katexStub);
  assert.ok(out.includes('data-display="true"'), 'display math should set displayMode');
});

test('\\(...\\) and \\[...\\] delimiters also render', () => {
  assert.ok(renderMarkdown('a \\(y+1\\) b', katexStub).includes('KX:y+1'));
  assert.ok(renderMarkdown('\\[z=2\\]', katexStub).includes('data-display="true"'));
});

test('real numbers in prose are NOT treated as math (sentinel has no collision)', () => {
  const out = renderMarkdown('I have 5 apples and $x$ here', katexStub);
  assert.ok(out.includes('5 apples'), 'plain number preserved as prose');
  assert.ok(out.includes('KX:x'), 'only the delimited math is rendered');
});

test('without KaTeX, math falls back to the ESCAPED literal (never raw HTML)', () => {
  const out = renderMarkdown('try $<script>alert(1)</script>$', null);
  assert.ok(!out.includes('<script>'), 'no raw script in fallback');
  assert.ok(out.includes('$') && out.includes('&lt;script&gt;'), 'escaped literal shown');
});

test('markdown bold/italic/code still work alongside math', () => {
  const out = renderMarkdown('**bold** *it* `c` and $a$', katexStub);
  assert.ok(out.includes('<strong>bold</strong>'));
  assert.ok(out.includes('<em>it</em>'));
  assert.ok(out.includes('<code'));
  assert.ok(out.includes('KX:a'));
});

test('a stray sentinel token never throws and is left intact', () => {
  const out = renderMarkdown('weird @@MATH9@@ token', katexStub);
  assert.ok(out.includes('@@MATH9@@'), 'unknown index returned unchanged');
});
