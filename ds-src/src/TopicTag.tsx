import type { ReactNode } from 'react';

export interface TopicTagProps {
  /** Tag label. */
  children?: ReactNode;
  className?: string;
}

/**
 * Small rounded tag for topics and skills (e.g. "Fractions", "Photosynthesis").
 * Lay several inline to form a topic cloud.
 */
export function TopicTag({ children, className }: TopicTagProps) {
  return <span className={['topic-tag', className].filter(Boolean).join(' ')}>{children}</span>;
}
