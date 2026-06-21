import { LiveBadge } from '@zeluu/design-system';

export const LiveTutoring = () => <LiveBadge>Live tutoring</LiveBadge>;

export const NewLessons = () => <LiveBadge dot={false}>New lessons weekly</LiveBadge>;

export const OnSectionHeader = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '16px 20px',
      borderRadius: 12,
      background: 'var(--color-surface, #fdf8f0)',
      border: '1px solid var(--color-border, #e7dccb)',
      maxWidth: 420,
    }}
  >
    <LiveBadge>Now tutoring</LiveBadge>
    <span style={{ fontWeight: 600 }}>Layla — Grade 4 Math</span>
  </div>
);
