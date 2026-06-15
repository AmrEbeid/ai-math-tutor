// Shared, XSS-safe, math-aware renderer for tutor/exam content.
//
// SECURITY MODEL (preserves the existing escape-first invariant):
//  1. Math segments ($$...$$, \[...\], $...$, \(...\)) are stashed out BEFORE escaping,
//     replaced by an inert sentinel token (@@MATH<n>@@) that survives HTML-escaping and
//     the markdown passes without collision.
//  2. The remaining PROSE is HTML-escaped first, then simple markdown is applied — so any
//     model/user text can never inject markup or event handlers.
//  3. Stashed math is rendered by KaTeX with { trust:false, throwOnError:false } (KaTeX's
//     own output is safe HTML). If KaTeX is unavailable, the math falls back to the
//     ESCAPED literal (e.g. "$x^2$") — never raw HTML.
//
// Used by public/app.html (chat) and public/exam-prep.html (exam) via window.Zeluu.
// Unit-tested in tests/render-katex.test.mjs (KaTeX is injected, so tests need no install).
//
// Known limitation (documented): a bare "$" used as currency can be mis-detected as an
// inline-math delimiter. Tutor output should write currency as words ("5 dollars"). This
// never produces unsafe output — at worst a currency string renders as math or falls back.

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };

export function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, m => ESC[m]);
}

export function renderMarkdown(text, katex) {
  const segs = [];
  const stash = (tex, display) => `@@MATH${segs.push({ tex, display }) - 1}@@`;

  // 1. Pull math out BEFORE escaping (display delimiters first, then inline).
  let work = String(text)
    .replace(/\$\$([^$]+)\$\$/g, (_, m) => stash(m, true))
    .replace(/\\\[([\s\S]+?)\\\]/g, (_, m) => stash(m, true))
    .replace(/\$([^$\n]+)\$/g, (_, m) => stash(m, false))
    .replace(/\\\(([\s\S]+?)\\\)/g, (_, m) => stash(m, false));

  // 2. Escape prose first, then apply the existing simple markdown set.
  work = escapeHtml(work)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code style="background:#F0F0FF; padding:2px 6px; border-radius:4px; font-size:14px;">$1</code>')
    .replace(/\n/g, '<br>');

  // 3. Re-insert math: KaTeX-rendered when available, else the ESCAPED literal.
  return work.replace(/@@MATH(\d+)@@/g, (full, n) => {
    const seg = segs[Number(n)];
    if (!seg) return full; // defensive: never throw on a stray token
    const literal = (seg.display ? '$$' : '$') + seg.tex + (seg.display ? '$$' : '$');
    if (!katex || typeof katex.renderToString !== 'function') return escapeHtml(literal);
    try {
      return katex.renderToString(seg.tex, {
        displayMode: seg.display,
        throwOnError: false,
        trust: false,
        strict: 'warn',
      });
    } catch {
      return escapeHtml(literal);
    }
  });
}
