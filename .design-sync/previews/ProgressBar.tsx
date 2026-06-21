import { ProgressBar } from '@zeluu/design-system';

const row = { display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, color: 'var(--color-text-muted)' } as const;

export const ExamProgress = () => (
  <div style={{ maxWidth: 420 }}>
    <div style={row}><span>Question 3 of 12</span><span>25%</span></div>
    <ProgressBar value={25} />
  </div>
);

export const CreditsUsed = () => (
  <div style={{ maxWidth: 420 }}>
    <div style={row}><span>Credits used</span><span>820 / 2,000</span></div>
    <ProgressBar value={41} />
  </div>
);

export const Complete = () => (
  <div style={{ maxWidth: 420 }}>
    <div style={{ marginBottom: 8, fontSize: 13, color: 'var(--color-text-muted)' }}>Lesson complete</div>
    <ProgressBar value={100} />
  </div>
);
