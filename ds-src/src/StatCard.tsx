import type { ReactNode } from 'react';

export interface StatCardProps {
  /** The headline value, rendered in accent terracotta. */
  value: ReactNode;
  /** Uppercase caption beneath the value. */
  label: ReactNode;
  className?: string;
}

/**
 * Bordered metric card for the dashboard: a large terracotta value above an
 * uppercase label. Use in a stats grid to surface usage or progress numbers.
 */
export function StatCard({ value, label, className }: StatCardProps) {
  return (
    <div className={['stat-card', className].filter(Boolean).join(' ')}>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
