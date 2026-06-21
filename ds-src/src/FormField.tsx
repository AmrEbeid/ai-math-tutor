import type { ReactNode } from 'react';

export interface FormFieldProps {
  /** Field label (rendered uppercase). */
  label: ReactNode;
  /** Input type (text, email, password, tel…). */
  type?: string;
  /** Placeholder text. */
  placeholder?: string;
  /** Controlled value. */
  value?: string;
  /** Validation/error message; shown in red beneath the input when set. */
  error?: ReactNode;
  /** `id`/`name` for the input element. */
  name?: string;
  className?: string;
}

/**
 * A labeled form input with the warm focus ring, plus an optional error line.
 * Wraps a single field; stack several inside a form.
 */
export function FormField({
  label,
  type = 'text',
  placeholder,
  value,
  error,
  name,
  className,
}: FormFieldProps) {
  return (
    <div className={['form-group', className].filter(Boolean).join(' ')}>
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} placeholder={placeholder} defaultValue={value} />
      {error && <div className="form-error" style={{ display: 'block' }}>{error}</div>}
    </div>
  );
}
