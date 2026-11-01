import React from 'react';
import clsx from 'clsx';
import { Inbox } from 'lucide-react';
import Button from './Button';

/**
 * EmptyState component for placeholders when data is missing or empty.
 *
 * @typedef {Object} EmptyStateProps
 * @property {React.ReactNode | React.ElementType} [icon] - Icon node or component
 * @property {string} title - Heading text for empty state
 * @property {string} [description] - Detailed explanation or guidance
 * @property {React.ReactNode} [action] - Custom action button or elements
 * @property {string} [actionLabel] - Convenience label to render a primary button
 * @property {() => void} [onAction] - Click callback for convenience button
 * @property {React.ReactNode} [children] - Optional extra content
 * @property {string} [className] - Additional classes
 */

export function EmptyState({
  icon: IconProp,
  title,
  description,
  action,
  actionLabel,
  onAction,
  children,
  className,
  ...props
}) {
  const renderIcon = () => {
    if (!IconProp) {
      return <Inbox size={24} className="text-neutral-500" />;
    }

    if (React.isValidElement(IconProp)) {
      return IconProp;
    }

    if (typeof IconProp === 'function') {
      const Component = IconProp;
      return <Component size={24} className="text-neutral-500" />;
    }

    return null;
  };

  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center text-center p-8 sm:p-12',
        'border border-dashed border-neutral-200 rounded-lg bg-neutral-50/50',
        className
      )}
      {...props}
    >
      <div className="w-12 h-12 rounded-xl bg-white border border-neutral-200 shadow-xs flex items-center justify-center text-neutral-600 mb-4">
        {renderIcon()}
      </div>

      <h3 className="text-base font-semibold text-neutral-900 mb-1">
        {title}
      </h3>

      {description && (
        <p className="text-sm text-neutral-500 max-w-sm mb-6 text-balance">
          {description}
        </p>
      )}

      {action ? (
        <div className="flex items-center gap-3">{action}</div>
      ) : actionLabel && onAction ? (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}

      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

export default EmptyState;
