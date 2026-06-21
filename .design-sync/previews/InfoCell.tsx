import { InfoCell } from '@zeluu/design-system';

const grid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(140px, 1fr))',
  gap: 12,
};

export const Subscription = () => (
  <div style={grid}>
    <InfoCell label="Plan" value="Family" />
    <InfoCell label="Status" value="Active" />
    <InfoCell label="Renews" value="Jul 14, 2026" />
  </div>
);

export const ChildProfile = () => (
  <div style={{ ...grid, gridTemplateColumns: 'repeat(2, minmax(140px, 1fr))' }}>
    <InfoCell label="Grade" value="Grade 5" />
    <InfoCell label="Focus subject" value="Mathematics" />
    <InfoCell label="Last active" value="Today, 4:12 PM" />
    <InfoCell label="Credits used" value="320 / month" />
  </div>
);

export const Single = () => (
  <div style={{ maxWidth: 200 }}>
    <InfoCell label="Billing" value="$29 / month" />
  </div>
);
