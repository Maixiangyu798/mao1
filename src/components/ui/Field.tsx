import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leading?: ReactNode
  trailing?: ReactNode
  fieldClassName?: string
}

export function Field({
  label,
  error,
  hint,
  leading,
  trailing,
  id,
  className,
  fieldClassName,
  ...inputProps
}: FieldProps) {
  const inputId = id ?? inputProps.name
  return (
    <div className={cn('field', error && 'field-has-error', fieldClassName)}>
      {label && (
        <label className="field-label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className="input-shell">
        {leading && <span className="input-leading">{leading}</span>}
        <input
          id={inputId}
          className={cn(
            'input',
            Boolean(leading) && 'has-leading',
            Boolean(trailing) && 'has-trailing',
            className,
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...inputProps}
        />
        {trailing && <span className="input-trailing">{trailing}</span>}
      </div>
      {error ? (
        <p className="field-error" id={`${inputId}-error`}>
          {error}
        </p>
      ) : hint ? (
        <p className="field-hint" id={`${inputId}-hint`}>
          {hint}
        </p>
      ) : null}
    </div>
  )
}
