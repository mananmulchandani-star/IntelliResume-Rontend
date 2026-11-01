import React, { forwardRef } from 'react';
import clsx from 'clsx';

/**
 * Card component for grouped content presentation.
 *
 * @typedef {'default' | 'interactive'} CardVariant
 * @typedef {'none' | 'sm' | 'md' | 'lg'} CardPadding
 *
 * @typedef {Object} CardProps
 * @property {CardVariant} [variant='default'] - Card behavior and styling variant
 * @property {CardPadding} [padding='md'] - Inner padding amount
 * @property {React.ReactNode} children - Card content
 * @property {string} [className] - Additional classes
 */

const paddingStyles = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card = forwardRef(function Card(
  {
    children,
    variant = 'default',
    padding = 'none',
    className,
    ...props
  },
  ref
) {
  const isInteractive = variant === 'interactive';

  return (
    <div
      ref={ref}
      className={clsx(
        'bg-white rounded-lg border border-neutral-200 text-neutral-900',
        paddingStyles[padding],
        'transition-all duration-150',
        isInteractive && [
          'cursor-pointer',
          'hover:border-neutral-300 hover:shadow-md hover:-translate-y-0.5',
          'active:translate-y-0 active:shadow-xs',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
        ],
        !isInteractive && 'shadow-xs',
        className
      )}
      tabIndex={isInteractive ? 0 : undefined}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export const CardHeader = forwardRef(function CardHeader(
  { className, children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={clsx('flex flex-col space-y-1.5 p-6 border-b border-neutral-100', className)}
      {...props}
    >
      {children}
    </div>
  );
});
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef(function CardTitle(
  { className, children, as = 'h3', ...props },
  ref
) {
  return React.createElement(
    as,
    {
      ref,
      className: clsx('font-semibold text-neutral-900 text-base leading-none tracking-tight', className),
      ...props,
    },
    children
  );
});
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef(function CardDescription(
  { className, children, ...props },
  ref
) {
  return (
    <p
      ref={ref}
      className={clsx('text-sm text-neutral-500 mt-1', className)}
      {...props}
    >
      {children}
    </p>
  );
});
CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef(function CardContent(
  { className, children, ...props },
  ref
) {
  return (
    <div ref={ref} className={clsx('p-6 pt-6', className)} {...props}>
      {children}
    </div>
  );
});
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef(function CardFooter(
  { className, children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={clsx('flex items-center p-6 pt-0 border-t border-neutral-100 mt-auto', className)}
      {...props}
    >
      {children}
    </div>
  );
});
CardFooter.displayName = 'CardFooter';

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
