import { StatCard } from '@zeluu/design-system';

const row: React.CSSProperties = {
  display: 'flex',
  gap: 16,
  flexWrap: 'wrap',
};

export const Dashboard = () => (
  <div style={row}>
    <StatCard value="1,240" label="Credits left" />
    <StatCard value="14" label="Lessons this week" />
    <StatCard value="9" label="Day streak" />
  </div>
);

export const Progress = () => (
  <div style={row}>
    <StatCard value="86%" label="Quiz accuracy" />
    <StatCard value="32" label="Topics mastered" />
  </div>
);

export const Single = () => (
  <div style={row}>
    <StatCard value="3h 20m" label="Time learning" />
  </div>
);
