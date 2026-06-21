import type { ReactNode } from 'react';

export interface CardProps {
  /** Optional header row, rendered with space-between (title left, actions right). */
  header?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/**
 * Surface container with a soft border that warms to the accent on hover. The
 * basic building block for dashboard panels and content groupings.
 */
export function Card({ header, children, className }: CardProps) {
  return (
    <div className={['card', className].filter(Boolean).join(' ')}>
      {header && <div className="card-header">{header}</div>}
      {children}
    </div>
  );
}
