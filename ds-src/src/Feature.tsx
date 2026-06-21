import type { ReactNode } from 'react';

export interface FeatureProps {
  /** Large emoji or glyph shown in the left icon column. */
  icon?: ReactNode;
  /** Feature title. */
  title: ReactNode;
  /** Supporting description. */
  children?: ReactNode;
  className?: string;
}

/**
 * Two-column marketing feature row: a large icon on the left, a heading and
 * description on the right, separated by a hairline rule from the next feature.
 */
export function Feature({ icon, title, children, className }: FeatureProps) {
  return (
    <div className={['feature', className].filter(Boolean).join(' ')}>
      <div className="feature-icon">{icon}</div>
      <div>
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
    </div>
  );
}
