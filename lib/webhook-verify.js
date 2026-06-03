import crypto from 'crypto';

/**
 * Pure HMAC-SHA256 verification of a LemonSqueezy webhook raw body against the
 * `X-Signature` header. The secret is passed in (never read from env here) so this
 * is unit-testable without `process.env` or the Supabase client.
 *
 * Returns true only on an exact, constant-time match. A missing/blank signature or
 * a length mismatch returns false (never throws) so a malformed signature is treated
 * as invalid (401) rather than a server error. A missing secret throws, since that is
 * a server misconfiguration, not a client problem.
 */
export function verifyLemonSqueezySignature(rawBody, signature, secret) {
  if (!secret) throw new Error('LEMONSQUEEZY_WEBHOOK_SECRET not set');
  if (!signature || typeof signature !== 'string') return false;
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  const expectedBuf = Buffer.from(expected, 'utf8');
  const givenBuf = Buffer.from(signature, 'utf8');
  if (expectedBuf.length !== givenBuf.length) return false; // timingSafeEqual requires equal length
  return crypto.timingSafeEqual(expectedBuf, givenBuf);
}
