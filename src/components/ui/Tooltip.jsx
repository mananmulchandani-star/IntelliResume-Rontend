import React, { useState, useRef, useId } from 'react';
import clsx from 'clsx';

/**
 * Tooltip component for hover/focus contextual descriptions.
 *
 * @typedef {'top' | 'bottom' | 'left' | 'right'} TooltipPosition
 *
 * @typedef {Object} TooltipProps
 * @property {React.ReactNode} content - Content shown inside the tooltip
 * @property {TooltipPosition} [position='top'] - Position relative to trigger
 * @property {number} [delay=150] - Delay in milliseconds before showing
 * @property {React.ReactElement} children - Target trigger element
 * @property {string} [className] - Additional classes for tooltip box
 */

const positionStyles = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

const arrowStyles = {
  top: 'top-full left-1/2 -translate-x-1/2 border-t-neutral-900 border-x-transparent border-b-transparent border-t-4 border-x-4 border-b-0',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-neutral-900 border-x-transparent border-t-transparent border-b-4 border-x-4 border-t-0',
  left: 'left-full top-1/2 -translate-y-1/2 border-l-neutral-900 border-y-transparent border-r-transparent border-l-4 border-y-4 border-r-0',
  right: 'right-full top-1/2 -translate-y-1/2 border-r-neutral-900 border-y-transparent border-l-transparent border-r-4 border-y-4 border-l-0',
};

export function Tooltip({
  content,
  position = 'top',
  delay = 150,
  children,
  className,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef(null);
  const tooltipId = useId();

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  if (!content) return children;

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {React.isValidElement(children)
        ? React.cloneElement(children, {
            'aria-describedby': isVisible ? tooltipId : undefined,
          })
        : children}

      {isVisible && (
        <div
          id={tooltipId}
          role="tooltip"
          className={clsx(
            'absolute z-50 pointer-events-none whitespace-nowrap',
            'px-2.5 py-1 text-xs font-medium text-white bg-neutral-900 rounded-md shadow-md',
            'animate-fade-in',
            positionStyles[position] || positionStyles.top,
            className
          )}
        >
          {content}
          <span
            className={clsx('absolute w-0 h-0', arrowStyles[position] || arrowStyles.top)}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
}

export default Tooltip;
