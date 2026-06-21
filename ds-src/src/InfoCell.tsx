import type { ReactNode } from 'react';

export interface InfoCellProps {
  /** Uppercase field label. */
  label: ReactNode;
  /** The value displayed beneath the label. */
  value: ReactNode;
  className?: string;
}

/**
 * Compact labeled value tile on a warm background — used to lay out read-only
 * detail fields (plan, status, dates) in account and dashboard views.
 */
export function InfoCell({ label, value, className }: InfoCellProps) {
  return (
    <div className={['info-cell', className].filter(Boolean).join(' ')}>
      <div className="info-cell-label">{label}</div>
      <div className="info-cell-value">{value}</div>
    </div>
  );
}
