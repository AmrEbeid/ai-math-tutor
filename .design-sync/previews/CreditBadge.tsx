import { CreditBadge } from '@zeluu/design-system';

const row: React.CSSProperties = {
  display: 'flex',
  gap: 12,
  alignItems: 'center',
  flexWrap: 'wrap',
};

export const Levels = () => (
  <div style={row}>
    <CreditBadge level="normal">1,240 credits</CreditBadge>
    <CreditBadge level="low">45 left</CreditBadge>
    <CreditBadge level="empty">0 left</CreditBadge>
  </div>
);

export const Normal = () => <CreditBadge level="normal">2,000 credits</CreditBadge>;

export const Low = () => <CreditBadge level="low">Running low — 80 credits</CreditBadge>;

export const Empty = () => <CreditBadge level="empty">Out of credits</CreditBadge>;
