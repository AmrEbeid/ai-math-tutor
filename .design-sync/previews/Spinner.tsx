import { Spinner } from '@zeluu/design-system';

export const WithStatusText = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <Spinner />
    <span style={{ color: 'var(--color-muted, #6b6257)', fontSize: 15 }}>
      Loading your lessons…
    </span>
  </div>
);

export const InButton = () => (
  <button className="btn" type="button" style={{ gap: 10 }}>
    <Spinner />
    Saving…
  </button>
);

export const GradingHomework = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '14px 18px',
      borderRadius: 12,
      border: '1px solid var(--color-border, #e7dccb)',
      background: 'var(--color-surface, #fdf8f0)',
      maxWidth: 320,
    }}
  >
    <Spinner />
    <span style={{ fontSize: 15 }}>Grading Layla's fractions quiz…</span>
  </div>
);
