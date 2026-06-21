import type { ReactNode } from 'react';

export type CreditLevel = 'normal' | 'low' | 'empty';

export interface CreditBadgeProps {
  /** Credit count or label. */
  children?: ReactNode;
  /** Severity: `normal` (accent), `low` (amber), `empty` (red). */
  level?: CreditLevel;
  className?: string;
}

/**
 * Pill that shows remaining tutoring credits, color-shifting from accent to
 * amber to red as the balance runs low or empties.
 */
export function CreditBadge({ children, level = 'normal', className }: CreditBadgeProps) {
  const cls = ['credit-badge', level === 'low' ? 'low' : level === 'empty' ? 'empty' : '', className]
    .filter(Boolean)
    .join(' ');
  return <span className={cls}>{children}</span>;
}
