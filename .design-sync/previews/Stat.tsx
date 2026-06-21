import { Stat } from '@zeluu/design-system';

const band: React.CSSProperties = {
  background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))',
  color: 'white',
  padding: '40px',
  borderRadius: 12,
  display: 'flex',
  gap: 48,
  flexWrap: 'wrap',
};

export const Band = () => (
  <div style={band}>
    <Stat value="50k+" label="Problems solved" />
    <Stat value="98%" label="Parent approval" />
    <Stat value="4.9★" label="App Store rating" />
  </div>
);

export const Reach = () => (
  <div style={band}>
    <Stat value="120k" label="Families learning" />
    <Stat value="3" label="Subjects covered" />
    <Stat value="1–9" label="Grades supported" />
  </div>
);

export const Single = () => (
  <div style={band}>
    <Stat value="2.4M" label="Lessons completed this year" />
  </div>
);
