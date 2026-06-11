import crypto from 'crypto';
import { getEnv } from './env.js';

// Read the signing secret at call time (not module load) so it is validated through the
// env layer with a clear, secret-free error and so the functions stay unit-testable.
function jwtSecret() {
  return getEnv('CHILD_JWT_SECRET'); // throws "Missing required env var: CHILD_JWT_SECRET"
}

// Sign a JWT token for child
export function signChildToken(payload) {
  const secret = jwtSecret(); // fail fast on missing secret (login path)
  // Create header.payload.signature
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');

  const message = `${header}.${body}`;
  const signature = crypto
    .createHmac('sha256', secret)
    .update(message)
    .digest('base64url');

  return `${message}.${signature}`;
}

// Verify and decode JWT token. Fails CLOSED (returns null) on any problem, including a
// missing signing secret — a misconfigured server rejects all child tokens rather than
// accepting unsigned ones.
export function verifyChildToken(token) {
  try {
    const secret = jwtSecret(); // throws if missing → caught below → null (fail closed)
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, body, signature] = parts;
    const message = `${header}.${body}`;

    // Verify signature (constant-time compare, same as the webhook verifier —
    // a plain !== leaks a timing oracle on the HMAC)
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(message)
      .digest('base64url');

    const sigBuf = Buffer.from(signature, 'utf8');
    const expBuf = Buffer.from(expectedSignature, 'utf8');
    if (sigBuf.length !== expBuf.length) return null;
    if (!crypto.timingSafeEqual(sigBuf, expBuf)) return null;

    // Decode payload
    const payload = JSON.parse(
      Buffer.from(body, 'base64url').toString('utf8')
    );

    // Check expiration
    if (payload.exp && payload.exp < Date.now() / 1000) {
      return null;
    }

    return payload;
  } catch (error) {
    return null;
  }
}

// Get auth context: try parent auth first, then child auth
export async function getChildOrUser(req) {
  // Lazily import the Supabase helper so the pure token-crypto exports above
  // (signChildToken/verifyChildToken) can be unit-tested without the DB client.
  const { getUser } = await import('./supabase.js');
  // Try parent Supabase auth first
  try {
    const user = await getUser(req);
    if (user) {
      return { type: 'parent', user, child: null };
    }
  } catch (error) {
    // Fall through to child auth
  }

  // Try child JWT auth
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return null;

  const payload = verifyChildToken(token);
  if (!payload) return null;

  return {
    type: 'child',
    user: null,
    child: {
      id: payload.child_id,
      parent_id: payload.parent_id,
      name: payload.child_name,
      grade: payload.grade,
      language: payload.language
    }
  };
}

// Get parent_id from either parent or child auth context
export function getParentId(authContext) {
  if (authContext.type === 'parent') {
    return authContext.user.id;
  } else if (authContext.type === 'child') {
    return authContext.child.parent_id;
  }
  return null;
}

// Get child_id from auth context (returns null for parents)
export function getChildId(authContext) {
  if (authContext.type === 'child') {
    return authContext.child.id;
  }
  return null;
}

// Resolve the child id an endpoint may act on. A child token is always pinned to
// its own child_id (any client-supplied id is ignored — children must not act on
// siblings); a parent may target any requested child, with ownership still
// enforced by the endpoint's parent_id-scoped query. Centralized here so every
// endpoint gets the same rule instead of re-implementing it per handler.
export function resolveChildId(authContext, requestedChildId) {
  return getChildId(authContext) || requestedChildId || null;
}
