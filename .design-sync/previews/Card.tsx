import { Card } from '@zeluu/design-system';

export const Basic = () => (
  <div style={{ maxWidth: 380 }}>
    <Card>
      <h3 style={{ margin: '0 0 8px' }}>Welcome back, Sara</h3>
      <p style={{ margin: 0, color: 'var(--color-muted, #6b6257)' }}>
        Layla has 3 homework sessions and a fractions quiz scheduled this week.
        She has 420 credits remaining on the Family plan.
      </p>
    </Card>
  </div>
);

export const WithHeader = () => (
  <div style={{ maxWidth: 380 }}>
    <Card
      header={
        <>
          <strong>Layla's progress</strong>
          <a className="nav-signin" href="#">
            View report
          </a>
        </>
      }
    >
      <p style={{ margin: '0 0 12px', color: 'var(--color-muted, #6b6257)' }}>
        Grade 4 · Math, Science &amp; English
      </p>
      <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
        <li>Mastered: multiplication tables, place value</li>
        <li>Practising: long division, fractions</li>
        <li>Next up: word problems</li>
      </ul>
    </Card>
  </div>
);
