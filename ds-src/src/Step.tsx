import type { ReactNode } from 'react';

export interface StepProps {
  /** Step number shown inside the terracotta circle. */
  number: ReactNode;
  /** Step title. */
  title: ReactNode;
  /** Supporting description. */
  children?: ReactNode;
  className?: string;
}

/**
 * A single "how it works" step: a numbered terracotta circle above a centered
 * title and description. Lay several in a row to form the steps timeline.
 */
export function Step({ number, title, children, className }: StepProps) {
  return (
    <div className={['step', className].filter(Boolean).join(' ')}>
      <div className="step-num">{number}</div>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}
