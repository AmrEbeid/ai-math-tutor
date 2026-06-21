import type { ReactNode } from 'react';

export interface ContainerProps {
  children?: ReactNode;
  className?: string;
}

/**
 * Centered max-width (1280px) page container with horizontal gutters. Wrap page
 * sections in it to align content to the Zeluu grid.
 */
export function Container({ children, className }: ContainerProps) {
  return <div className={['container', className].filter(Boolean).join(' ')}>{children}</div>;
}
