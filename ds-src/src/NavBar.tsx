import type { ReactNode } from 'react';

export interface NavBarProps {
  /** Brand label shown at the left (paired with an optional logo glyph). */
  brand?: ReactNode;
  /** Optional leading logo/emoji glyph rendered before the brand text. */
  logo?: ReactNode;
  /** Right-aligned content — typically a sign-in link or action. */
  actions?: ReactNode;
  className?: string;
}

/**
 * Sticky, frosted top navigation bar in the warm-editorial style: brand on the
 * left, actions on the right. Sits inside a `.container` for max-width.
 */
export function NavBar({ brand = 'Zeluu', logo, actions, className }: NavBarProps) {
  return (
    <nav className={['nav', className].filter(Boolean).join(' ')}>
      <div className="container nav-inner">
        <a className="nav-brand" href="#">
          {logo}
          <span className="nav-brand-text">{brand}</span>
        </a>
        {actions}
      </div>
    </nav>
  );
}
