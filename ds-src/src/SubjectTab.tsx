import type { ReactNode, MouseEventHandler } from 'react';

export interface SubjectTabProps {
  /** Tab label (e.g. "Math", "Science"). */
  label: ReactNode;
  /** Optional leading emoji/glyph icon. */
  icon?: ReactNode;
  /** Active (selected) state — underlined in accent. */
  active?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

/**
 * Underlined tab used to switch tutoring subjects in the child app. Selected
 * tabs carry a terracotta underline; render a group inside `.subject-tabs`.
 */
export function SubjectTab({ label, icon, active, onClick, className }: SubjectTabProps) {
  const cls = ['subject-tab', active ? 'active' : '', className].filter(Boolean).join(' ');
  return (
    <button className={cls} onClick={onClick}>
      {icon && <span className="tab-icon">{icon}</span>}
      {label}
    </button>
  );
}
