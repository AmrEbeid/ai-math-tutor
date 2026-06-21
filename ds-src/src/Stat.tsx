import type { ReactNode } from 'react';

export interface StatProps {
  /** The large display number (e.g. "12k", "98%"). */
  value: ReactNode;
  /** Caption beneath the number. */
  label: ReactNode;
  className?: string;
}

/**
 * Big-number statistic for the marketing stats band. Designed to sit on the
 * accent/terracotta gradient surface, so the number inherits the band's color.
 */
export function Stat({ value, label, className }: StatProps) {
  return (
    <div className={['stat', className].filter(Boolean).join(' ')}>
      <div className="stat-num">{value}</div>
      <div className="stat-text">{label}</div>
    </div>
  );
}
