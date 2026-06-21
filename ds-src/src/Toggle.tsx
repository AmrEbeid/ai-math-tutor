import type { ReactNode } from 'react';

export interface ToggleOption {
  /** Stable value identifying the segment. */
  value: string;
  /** Visible label. */
  label: ReactNode;
  /** Optional badge after the label (e.g. "Save 20%"). */
  badge?: ReactNode;
}

export interface ToggleProps {
  /** The segments. */
  options: ToggleOption[];
  /** The currently-selected segment's `value`. */
  value: string;
  /** Called with the new value when a segment is clicked. */
  onChange?: (value: string) => void;
  className?: string;
}

/**
 * Pill-style segmented control — used for the pricing billing switch
 * (Monthly / Annual) and similar 2–3 option choices. Exactly one segment is
 * active; pass an optional `badge` per option for things like a savings tag.
 */
export function Toggle({ options, value, onChange, className }: ToggleProps) {
  return (
    <div className={['toggle-pill', className].filter(Boolean).join(' ')}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className={o.value === value ? 'active' : undefined}
          aria-pressed={o.value === value}
          onClick={() => onChange?.(o.value)}
        >
          {o.label}
          {o.badge != null && <span className="save-badge">{o.badge}</span>}
        </button>
      ))}
    </div>
  );
}
