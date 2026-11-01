import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

/**
 * Button component for actions and form triggers.
 *
 * @typedef {'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'} ButtonVariant
 * @typedef {'sm' | 'md' | 'lg'} ButtonSize
 *
 * @typedef {Object} ButtonProps
 * @property {React.ReactNode} [children] - Button content
 * @property {ButtonVariant} [variant='primary'] - Visual style variant
 * @property {ButtonSize} [size='md'] - Button size
 * @property {boolean} [isLoading=false] - Shows loading spinner and disables interactions
 * @property {boolean} [loading] - Alias for isLoading
 * @property {boolean} [disabled=false] - Disables the button
 * @property {React.ReactNode} [leftIcon] - Icon placed before children
 * @property {React.ReactNode} [rightIcon] - Icon placed after children
 * @property {boolean} [fullWidth=false] - Expands button to full container width
 * @property {string} [className] - Additional class names
 * @property {'button' | 'submit' | 'reset'} [type='button'] - Button type attribute
 */

const variantStyles = {
  primary:
    'bg-primary-600 text-white shadow-xs hover:bg-primary-700 active:bg-primary-800 focus-visible:ring-primary-500 border border-transparent',
  secondary:
    'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 active:bg-neutral-250 focus-visible:ring-neutral-400 border border-transparent',
  outline:
    'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50 hover:text-neutral-900 hover:border-neutral-300 active:bg-neutral-100 focus-visible:ring-primary-500 shadow-xs',
  ghost:
    'bg-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 active:bg-neutral-150 focus-visible:ring-neutral-400 border border-transparent',
  danger:
    'bg-error-600 text-white shadow-xs hover:bg-error-700 active:bg-error-800 focus-visible:ring-error-500 border border-transparent',
};

const sizeStyles = {
  sm: 'h-8 px-2.5 text-xs gap-1.5 rounded-md font-medium',
  md: 'h-9 px-3.5 text-sm gap-2 rounded-md font-medium',
  lg: 'h-11 px-5 text-base gap-2.5 rounded-md font-medium',
};

const iconSizes = {
  sm: 14,
  md: 16,
  lg: 18,
};

export const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    loading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    className,
    type = 'button',
    ...props
  },
  ref
) {
  const isBusy = Boolean(isLoading || loading);
  const isDisabled = disabled || isBusy;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={isBusy}
      aria-disabled={isDisabled}
      className={clsx(
        // Base layout & typography
        'inline-flex items-center justify-center font-medium whitespace-nowrap',
        'select-none transition-all duration-150 cursor-pointer',
        // Focus state
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        // Variants & Sizes
        variantStyles[variant] || variantStyles.primary,
        sizeStyles[size] || sizeStyles.md,
        fullWidth && 'w-full',
        // Disabled / Busy states
        isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none shadow-none',
        className
      )}
      {...props}
    >
      {isBusy ? (
        <>
          <Loader2
            size={iconSizes[size] || 16}
            className="animate-spin shrink-0"
            aria-hidden="true"
          />
          {children && <span>{children}</span>}
        </>
      ) : (
        <>
          {leftIcon && (
            <span className="shrink-0 inline-flex items-center" aria-hidden="true">
              {leftIcon}
            </span>
          )}
          {children && <span>{children}</span>}
          {rightIcon && (
            <span className="shrink-0 inline-flex items-center" aria-hidden="true">
              {rightIcon}
            </span>
          )}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
