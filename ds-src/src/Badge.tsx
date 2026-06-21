import type { ReactNode } from 'react';

export type BadgeStatus = 'now' | 'soon';

export interface BadgeProps {
  /** `now` = available (accent outline); `soon` = coming soon (muted outline). */
  status?: BadgeStatus;
  children?: ReactNode;
  className?: string;
}

/**
 * Small uppercase status pill used on feature lists — "Available now" (accent
 * outline) vs "Coming soon" (muted outline).
 */
export function Badge({ status = 'now', children, className }: BadgeProps) {
  const cls = [status === 'soon' ? 'badge-soon' : 'badge-now', className].filter(Boolean).join(' ');
  return <span className={cls}>{children}</span>;
}
