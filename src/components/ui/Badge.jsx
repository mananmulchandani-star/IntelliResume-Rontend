import React from 'react';
import clsx from 'clsx';

/**
 * Badge component for tags, status indicators, and counters.
 *
 * @typedef {'default' | 'success' | 'warning' | 'error' | 'info'} BadgeVariant
 * @typedef {'sm' | 'md'} BadgeSize
 *
 * @typedef {Object} BadgeProps
 * @property {React.ReactNode} children - Badge label content
 * @property {BadgeVariant} [variant='default'] - Color variant representing status
 * @property {BadgeSize} [size='md'] - Sizing option
 * @property {boolean} [dot=false] - Display a status indicator dot
 * @property {React.ReactNode} [icon] - Icon placed inside the badge
 * @property {string} [className] - Additional class names
 */

const variantStyles = {
  default: {
    badge: 'bg-neutral-100 text-neutral-700 border-neutral-200',
    dot: 'bg-neutral-500',
  },
  success: {
    badge: 'bg-success-50 text-success-700 border-success-200',
    dot: 'bg-success-600',
  },
  warning: {
    badge: 'bg-warning-50 text-warning-700 border-warning-200',
    dot: 'bg-warning-600',
  },
  error: {
    badge: 'bg-error-50 text-error-700 border-error-200',
    dot: 'bg-error-600',
  },
  info: {
    badge: 'bg-primary-50 text-primary-700 border-primary-200',
    dot: 'bg-primary-600',
  },
};

const sizeStyles = {
  sm: 'text-[11px] px-2 py-0.5 gap-1.5 leading-none',
  md: 'text-xs px-2.5 py-1 gap-1.5 leading-normal',
};

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  icon,
  className,
  ...props
}) {
  const currentVariant = variantStyles[variant] || variantStyles.default;

  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full border transition-colors select-none',
        currentVariant.badge,
        sizeStyles[size] || sizeStyles.md,
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={clsx('w-1.5 h-1.5 rounded-full shrink-0', currentVariant.dot)}
          aria-hidden="true"
        />
      )}
      {icon && (
        <span className="shrink-0 flex items-center" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </span>
  );
}

export default Badge;
