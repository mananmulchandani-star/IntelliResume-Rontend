import React, { forwardRef, useId } from 'react';
import clsx from 'clsx';
import { AlertCircle } from 'lucide-react';

/**
 * Input component for text and form inputs.
 *
 * @typedef {Object} InputProps
 * @property {string} [label] - Input label text
 * @property {string} [helperText] - Supporting helper text displayed below input
 * @property {string|boolean} [error] - Error message string or boolean error indicator
 * @property {React.ReactNode} [leftIcon] - Icon positioned inside left of input
 * @property {React.ReactNode} [rightIcon] - Icon positioned inside right of input
 * @property {string} [id] - Input id attribute
 * @property {boolean} [required] - Marks input as required
 * @property {boolean} [disabled] - Disables the input
 * @property {string} [className] - Additional class names for input element
 * @property {string} [containerClassName] - Class names for outer container
 */

export const Input = forwardRef(function Input(
  {
    label,
    helperText,
    error,
    leftIcon,
    rightIcon,
    id: customId,
    required,
    disabled = false,
    className,
    containerClassName,
    type = 'text',
    ...props
  },
  ref
) {
  const generatedId = useId();
  const inputId = customId || generatedId;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;

  const hasError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : null;

  return (
    <div className={clsx('w-full flex flex-col', containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-neutral-700 mb-1.5 select-none"
        >
          {label}
          {required && <span className="text-error-500 ml-1" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div
            className="absolute left-3 flex items-center pointer-events-none text-neutral-400"
            aria-hidden="true"
          >
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled}
          required={required}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={
            hasError ? errorId : helperText ? helperId : undefined
          }
          className={clsx(
            'w-full bg-white text-neutral-900 text-sm rounded-md border transition-all duration-150',
            'placeholder:text-neutral-400',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            // Default sizing and padding
            'h-9 py-2',
            leftIcon ? 'pl-9' : 'pl-3',
            rightIcon || hasError ? 'pr-9' : 'pr-3',
            // Border & ring styles based on state
            hasError
              ? 'border-error-500 text-neutral-900 focus:border-error-500 focus:ring-error-500/20'
              : 'border-neutral-200 hover:border-neutral-300 focus:border-primary-500 focus:ring-primary-500/20',
            // Disabled styles
            disabled && 'bg-neutral-50 text-neutral-400 border-neutral-200 cursor-not-allowed pointer-events-none',
            className
          )}
          {...props}
        />

        {rightIcon && !hasError && (
          <div
            className="absolute right-3 flex items-center pointer-events-none text-neutral-400"
            aria-hidden="true"
          >
            {rightIcon}
          </div>
        )}

        {hasError && (
          <div
            className="absolute right-3 flex items-center pointer-events-none text-error-500"
            aria-hidden="true"
          >
            <AlertCircle size={16} />
          </div>
        )}
      </div>

      {hasError && errorMessage ? (
        <p id={errorId} className="text-xs text-error-600 mt-1.5 flex items-center gap-1">
          {errorMessage}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-xs text-neutral-500 mt-1.5">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';

/**
 * Textarea component for multiline text input.
 */
export const Textarea = forwardRef(function Textarea(
  {
    label,
    helperText,
    error,
    id: customId,
    required,
    disabled = false,
    rows = 4,
    className,
    containerClassName,
    ...props
  },
  ref
) {
  const generatedId = useId();
  const inputId = customId || generatedId;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;

  const hasError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : null;

  return (
    <div className={clsx('w-full flex flex-col', containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-neutral-700 mb-1.5 select-none"
        >
          {label}
          {required && <span className="text-error-500 ml-1" aria-hidden="true">*</span>}
        </label>
      )}

      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        disabled={disabled}
        required={required}
        aria-invalid={hasError ? 'true' : 'false'}
        aria-describedby={
          hasError ? errorId : helperText ? helperId : undefined
        }
        className={clsx(
          'w-full bg-white text-neutral-900 text-sm rounded-md border transition-all duration-150',
          'placeholder:text-neutral-400 p-3 resize-y',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          hasError
            ? 'border-error-500 text-neutral-900 focus:border-error-500 focus:ring-error-500/20'
            : 'border-neutral-200 hover:border-neutral-300 focus:border-primary-500 focus:ring-primary-500/20',
          disabled && 'bg-neutral-50 text-neutral-400 border-neutral-200 cursor-not-allowed pointer-events-none',
          className
        )}
        {...props}
      />

      {hasError && errorMessage ? (
        <p id={errorId} className="text-xs text-error-600 mt-1.5 flex items-center gap-1">
          {errorMessage}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-xs text-neutral-500 mt-1.5">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Input;
