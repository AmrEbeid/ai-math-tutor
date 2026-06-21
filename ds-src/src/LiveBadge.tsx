import type { ReactNode } from 'react';

export interface LiveBadgeProps {
  /** Badge label. */
  children?: ReactNode;
  /** Show the pulsing status dot at the leading edge (default true). */
  dot?: boolean;
  className?: string;
}

/**
 * Small rounded pill used in heroes and section headers to signal a live or
 * highlighted status, with an optional pulsing accent dot.
 */
export function LiveBadge({ children = 'Live now', dot = true, className }: LiveBadgeProps) {
  return (
    <span className={['hero-badge', className].filter(Boolean).join(' ')}>
      {dot && <span className="pulse-dot" />}
      {children}
    </span>
  );
}
