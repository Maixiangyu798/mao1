import type { MouseEventHandler, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { LoaderCircle } from 'lucide-react'
import { cn } from '@/utils/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'text' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface BaseProps {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: ReactNode
  iconRight?: ReactNode
  loading?: boolean
  fullWidth?: boolean
  className?: string
  disabled?: boolean
  title?: string
  'aria-label'?: string
}

interface ButtonAsButton extends BaseProps {
  to?: undefined
  type?: 'button' | 'submit' | 'reset'
  onClick?: MouseEventHandler<HTMLButtonElement>
}

interface ButtonAsLink extends BaseProps {
  to: string
  state?: unknown
  replace?: boolean
}

export type ButtonProps = ButtonAsButton | ButtonAsLink

export function Button(props: ButtonProps) {
  const {
    children,
    variant = 'primary',
    size = 'md',
    icon,
    iconRight,
    loading,
    fullWidth,
    className,
    disabled,
  } = props
  const classes = cn(
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth && 'btn-full',
    loading && 'is-loading',
    className,
  )
  const content = (
    <>
      {loading ? (
        <LoaderCircle size={16} className="spin" aria-hidden="true" />
      ) : (
        icon && <span className="btn-icon">{icon}</span>
      )}
      <span>{children}</span>
      {!loading && iconRight && <span className="btn-icon">{iconRight}</span>}
    </>
  )

  if (props.to) {
    const linkProps = props as ButtonAsLink
    return (
      <Link
        to={linkProps.to}
        state={linkProps.state}
        replace={linkProps.replace}
        className={classes}
        aria-disabled={disabled || loading || undefined}
        aria-label={linkProps['aria-label']}
        title={linkProps.title}
        onClick={(event) => {
          if (disabled || loading) event.preventDefault()
        }}
      >
        {content}
      </Link>
    )
  }

  const buttonProps = props as ButtonAsButton
  return (
    <button
      type={buttonProps.type ?? 'button'}
      className={classes}
      disabled={disabled || loading}
      onClick={buttonProps.onClick}
      aria-label={buttonProps['aria-label']}
      title={buttonProps.title}
    >
      {content}
    </button>
  )
}
