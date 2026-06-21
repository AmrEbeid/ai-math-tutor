import type { ReactNode, MouseEventHandler } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'white';
export type ButtonSize = 'sm' | 'md' | 'large';

export interface ButtonProps {
  /** Visual style. `primary` is the filled terracotta CTA; `secondary` is outlined; `white` is for use on accent/dark surfaces. */
  variant?: ButtonVariant;
  /** Padding scale. `md` is the default marketing size. */
  size?: ButtonSize;
  /** When set, renders an anchor (`<a>`) styled as a button instead of a `<button>`. */
  href?: string;
  /** Disables the button (ignored when `href` is set). */
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLElement>;
  className?: string;
  children?: ReactNode;
}

/**
 * Zeluu's primary action control. Filled terracotta by default, with outlined
 * (`secondary`) and on-dark (`white`) variants and three padding sizes. Renders
 * an anchor when `href` is provided so it can act as a styled link.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  href,
  disabled,
  onClick,
  className,
  children,
}: ButtonProps) {
  const cls = [
    'btn',
    `btn-${variant}`,
    size === 'sm' ? 'btn-sm' : size === 'large' ? 'btn-large' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  if (href) {
    return (
      <a className={cls} href={href} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <button className={cls} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}
