import { createServerClient, getUser } from '../../lib/supabase.js';
import { getChildOrUser, getParentId } from '../../lib/child-auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const authContext = await getChildOrUser(req);
  if (!authContext) return res.status(401).json({ error: 'Not authenticated' });

  const parentId = getParentId(authContext);
  const isParent = authContext.type === 'parent';
  const supabase = createServerClient();

  const { data: balance } = await supabase.rpc('get_credit_balance', {
    p_parent_id: parentId
  });

  // Billing detail is parent-only. A child session token is widened to its parent's scope
  // (getParentId) and uses the service-role client (RLS bypassed), so it must NOT receive the
  // parent's payment history or subscription/billing metadata. Children only get the credit
  // count, which their app needs to gate tutoring usage.
  let transactions = [];
  let subscription = null;

  if (isParent) {
    ({ data: transactions } = await supabase
      .from('credit_ledger')
      .select('*')
      .eq('parent_id', parentId)
      .order('created_at', { ascending: false })
      .limit(10));

    ({ data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('parent_id', parentId)
      .in('status', ['active', 'trialing'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single());
  }

  return res.status(200).json({
    credits: balance || 0,
    recent_transactions: transactions || [],
    subscription: subscription || null
  });
}
