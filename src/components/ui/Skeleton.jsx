import React from 'react';
import clsx from 'clsx';

/**
 * Skeleton component for loading placeholder states.
 *
 * @typedef {'text' | 'circle' | 'rect'} SkeletonVariant
 *
 * @typedef {Object} SkeletonProps
 * @property {SkeletonVariant} [variant='rect'] - Shape variant
 * @property {string|number} [width] - Explicit width (e.g. 120 or '100%')
 * @property {string|number} [height] - Explicit height (e.g. 24 or '2rem')
 * @property {boolean} [animate=true] - Whether to show the pulsing animation
 * @property {string} [className] - Additional classes
 */

const variantStyles = {
  text: 'h-4 w-full rounded',
  circle: 'rounded-full shrink-0',
  rect: 'rounded-md w-full h-24',
};

export function Skeleton({
  variant = 'rect',
  width,
  height,
  animate = true,
  className,
  style,
  ...props
}) {
  const customStyles = {
    ...(width !== undefined && {
      width: typeof width === 'number' ? `${width}px` : width,
    }),
    ...(height !== undefined && {
      height: typeof height === 'number' ? `${height}px` : height,
    }),
    ...style,
  };

  return (
    <div
      role="status"
      aria-label="Loading..."
      aria-busy="true"
      className={clsx(
        'bg-neutral-200/80 select-none overflow-hidden',
        animate && 'animate-pulse',
        variantStyles[variant] || variantStyles.rect,
        className
      )}
      style={customStyles}
      {...props}
    />
  );
}

export default Skeleton;
