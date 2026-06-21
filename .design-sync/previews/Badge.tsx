import { Badge } from '@zeluu/design-system';

export const Now = () => (
  <span style={{ fontSize: 15, color: 'var(--color-text-dark)' }}>
    Photo problem support <Badge status="now">Available now</Badge>
  </span>
);

export const Soon = () => (
  <span style={{ fontSize: 15, color: 'var(--color-text-dark)' }}>
    Weekly progress digest <Badge status="soon">Coming soon</Badge>
  </span>
);

export const FeatureList = () => (
  <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 15, lineHeight: 2.2, color: 'var(--color-text-dark)' }}>
    <li>AI Socratic tutoring <Badge status="now">Available now</Badge></li>
    <li>Photo problem support <Badge status="now">Available now</Badge></li>
    <li>Weekly digest <Badge status="soon">Coming soon</Badge></li>
  </ul>
);
