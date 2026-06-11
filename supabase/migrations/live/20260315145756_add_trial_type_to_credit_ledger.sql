
ALTER TABLE credit_ledger DROP CONSTRAINT credit_ledger_type_check;
ALTER TABLE credit_ledger ADD CONSTRAINT credit_ledger_type_check
  CHECK (type = ANY (ARRAY['signup_bonus', 'purchase', 'subscription', 'trial', 'usage', 'rollover', 'expiry', 'refund']));
