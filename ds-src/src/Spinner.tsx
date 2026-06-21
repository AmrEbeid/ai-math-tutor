export interface SpinnerProps {
  className?: string;
}

/**
 * Small inline loading spinner with a terracotta head. Drop it inside buttons
 * or next to status text while an async action runs.
 */
export function Spinner({ className }: SpinnerProps) {
  return <span className={['spinner', className].filter(Boolean).join(' ')} role="status" aria-label="Loading" />;
}
