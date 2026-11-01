import React, { forwardRef, useId } from 'react';
import clsx from 'clsx';
import { ChevronDown, AlertCircle } from 'lucide-react';

/**
 * Select component for dropdown choice selection.
 *
 * @typedef {Object} SelectOption
 * @property {string|number} value - The option value
 * @property {string} label - The option display label
 * @property {boolean} [disabled] - Disables this specific option
 *
 * @typedef {Object} SelectProps
 * @property {string} [label] - Label text
 * @property {string} [placeholder] - Placeholder text for unselected state
 * @property {string|boolean} [error] - Error message or boolean flag
 * @property {string} [helperText] - Supporting helper text
 * @property {SelectOption[]} [options=[]] - List of options to render
 * @property {React.ReactNode} [children] - Optional custom option elements
 * @property {string} [id] - Input id
 * @property {boolean} [required] - Required field indicator
 * @property {boolean} [disabled] - Disables the select element
 * @property {string} [className] - Additional class names for select element
 * @property {string} [containerClassName] - Additional class names for outer container
 */

export const Select = forwardRef(function Select(
  {
    label,
    placeholder,
    error,
    helperText,
    options = [],
    children,
    id: customId,
    required,
    disabled = false,
    className,
    containerClassName,
    defaultValue,
    value,
    ...props
  },
  ref
) {
  const generatedId = useId();
  const selectId = customId || generatedId;
  const helperId = `${selectId}-helper`;
  const errorId = `${selectId}-error`;

  const hasError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : null;

  return (
    <div className={clsx('w-full flex flex-col', containerClassName)}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-neutral-700 mb-1.5 select-none"
        >
          {label}
          {required && <span className="text-error-500 ml-1" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="relative flex items-center w-full">
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          required={required}
          value={value}
          defaultValue={defaultValue}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={
            hasError ? errorId : helperText ? helperId : undefined
          }
          className={clsx(
            'w-full bg-white text-neutral-900 text-sm rounded-md border appearance-none transition-all duration-150',
            'h-9 py-2 pl-3 pr-10 cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            // Border & ring states
            hasError
              ? 'border-error-500 text-neutral-900 focus:border-error-500 focus:ring-error-500/20'
              : 'border-neutral-200 hover:border-neutral-300 focus:border-primary-500 focus:ring-primary-500/20',
            // Disabled state
            disabled && 'bg-neutral-50 text-neutral-400 border-neutral-200 cursor-not-allowed pointer-events-none',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled className="text-neutral-400">
              {placeholder}
            </option>
          )}

          {options && options.length > 0
            ? options.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.disabled}
                >
                  {opt.label}
                </option>
              ))
            : children}
        </select>

        {/* Custom Dropdown Chevron or Error Icon */}
        <div className="absolute right-3 flex items-center gap-1.5 pointer-events-none text-neutral-400">
          {hasError && (
            <AlertCircle size={16} className="text-error-500" aria-hidden="true" />
          )}
          <ChevronDown size={16} className="text-neutral-500" aria-hidden="true" />
        </div>
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

Select.displayName = 'Select';

export default Select;
