import React from 'react';
import clsx from 'clsx';

/**
 * Spinner component for circular loading states.
 *
 * @typedef {'sm' | 'md' | 'lg'} SpinnerSize
 *
 * @typedef {Object} SpinnerProps
 * @property {SpinnerSize} [size='md'] - Spinner diameter: sm (16px), md (24px), lg (32px)
 * @property {string} [className] - Additional classes for coloring or margin
 * @property {string} [label='Loading'] - Accessible label for screen readers
 */

const sizeStyles = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

const strokeWidths = {
  sm: 3,
  md: 2.75,
  lg: 2.5,
};

export function Spinner({
  size = 'md',
  className,
  label = 'Loading',
  ...props
}) {
  const strokeWidth = strokeWidths[size] || 2.75;

  return (
    <span
      role="status"
      aria-label={label}
      className={clsx(
        'inline-flex items-center justify-center shrink-0',
        sizeStyles[size] || sizeStyles.md
      )}
      {...props}
    >
      <svg
        className={clsx('animate-spin w-full h-full text-primary-600', className)}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle
          className="opacity-20"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth={strokeWidth}
        />
        <path
          className="opacity-90"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}

export default Spinner;
