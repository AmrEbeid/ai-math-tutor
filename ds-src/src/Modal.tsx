import type { ReactNode } from 'react';

export interface ModalProps {
  /** Heading shown at the top of the dialog. */
  title?: ReactNode;
  /** Show the ✕ close affordance in the header. */
  closable?: boolean;
  children?: ReactNode;
  className?: string;
}

/**
 * Centered dialog rendered over a dimmed full-screen overlay. Used for
 * confirmations, install prompts, and detail views.
 */
export function Modal({ title, closable = true, children, className }: ModalProps) {
  return (
    <div className="modal-overlay">
      <div className={['modal', className].filter(Boolean).join(' ')}>
        {(title || closable) && (
          <div className="card-header">
            {title && <h2 className="m-0">{title}</h2>}
            {closable && <button className="modal-close" aria-label="Close">×</button>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
