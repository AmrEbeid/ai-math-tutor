import type { ReactNode } from 'react';
import { Modal } from '@zeluu/design-system';

// The Modal renders a `position: fixed` overlay (`.modal-overlay`). A wrapper
// with `transform` becomes its containing block, so the dimmed overlay fills
// THIS frame (not the page viewport) and the full dialog — title included —
// renders inside the preview card.
const Frame = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      position: 'relative',
      transform: 'translateZ(0)',
      width: 600,
      height: 420,
      background: 'var(--color-warm-bg)',
      borderRadius: 12,
      overflow: 'hidden',
    }}
  >
    {children}
  </div>
);

export const AddChild = () => (
  <Frame>
    <Modal title="Add a child profile">
      <p style={{ margin: '0 0 16px', color: 'var(--color-text-muted)' }}>
        Set up a profile so we can tailor lessons to your child's grade and pace.
        You can add up to 4 profiles on the Family plan.
      </p>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        <button className="btn btn-secondary" type="button">Cancel</button>
        <button className="btn" type="button">Add profile</button>
      </div>
    </Modal>
  </Frame>
);

export const CancelPlan = () => (
  <Frame>
    <Modal title="Cancel Family plan?">
      <p style={{ margin: '0 0 16px', color: 'var(--color-text-muted)' }}>
        Your plan stays active until 12 July. After that, Layla and Omar will lose
        access to tutoring and saved progress reports.
      </p>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        <button className="btn btn-secondary" type="button">Keep my plan</button>
        <button className="btn" type="button">Cancel plan</button>
      </div>
    </Modal>
  </Frame>
);
