export interface ProgressBarProps {
  /** Completion percentage, 0–100. */
  value: number;
  className?: string;
}

/**
 * Thin track + accent fill — used for exam progress and usage/credit meters.
 * Clamp-safe: values outside 0–100 are bounded.
 */
export function ProgressBar({ value, className }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={['progress-bar', className].filter(Boolean).join(' ')}>
      <div className="progress-fill" style={{ width: `${pct}%` }} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} />
    </div>
  );
}
