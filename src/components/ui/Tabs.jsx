import React, { createContext, useContext, useState, useRef } from 'react';
import clsx from 'clsx';

/**
 * Tabs navigation component with underline style.
 */

const TabsContext = createContext(null);

export function Tabs({
  value,
  defaultValue,
  onChange,
  children,
  className,
  ...props
}) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const activeValue = isControlled ? value : internalValue;

  const handleTabChange = (val) => {
    if (!isControlled) {
      setInternalValue(val);
    }
    onChange?.(val);
  };

  const tabsRef = useRef(null);

  // Keyboard navigation for tablist (ArrowLeft, ArrowRight, Home, End)
  const handleKeyDown = (e) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return;

    const tabs = Array.from(
      tabsRef.current?.querySelectorAll('[role="tab"]:not([disabled])') || []
    );
    if (!tabs.length) return;

    const currentIndex = tabs.findIndex((tab) => tab === document.activeElement);
    let nextIndex = 0;

    if (e.key === 'ArrowRight') {
      nextIndex = currentIndex + 1 >= tabs.length ? 0 : currentIndex + 1;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = currentIndex - 1 < 0 ? tabs.length - 1 : currentIndex - 1;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = tabs.length - 1;
    }

    e.preventDefault();
    tabs[nextIndex]?.focus();
    tabs[nextIndex]?.click();
  };

  return (
    <TabsContext.Provider value={{ activeValue, onSelect: handleTabChange }}>
      <div
        ref={tabsRef}
        role="tablist"
        aria-orientation="horizontal"
        onKeyDown={handleKeyDown}
        className={clsx(
          'flex items-center gap-6 border-b border-neutral-200 overflow-x-auto scrollbar-thin',
          className
        )}
        {...props}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function Tab({
  value,
  children,
  icon,
  badge,
  disabled = false,
  className,
  ...props
}) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tab must be used within a Tabs component');
  }

  const { activeValue, onSelect } = context;
  const isActive = activeValue === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-disabled={disabled}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={() => !disabled && onSelect(value)}
      className={clsx(
        // Base positioning & transitions
        'relative inline-flex items-center gap-2 py-3 px-1 text-sm font-medium transition-all duration-150',
        'border-b-2 -mb-[1px] whitespace-nowrap cursor-pointer select-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-t-sm',
        // State variants
        isActive
          ? 'border-primary-600 text-primary-600'
          : 'border-transparent text-neutral-500 hover:text-neutral-800 hover:border-neutral-300',
        // Disabled state
        disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
        className
      )}
      {...props}
    >
      {icon && (
        <span
          className={clsx(
            'shrink-0 transition-colors',
            isActive ? 'text-primary-600' : 'text-neutral-400 group-hover:text-neutral-600'
          )}
          aria-hidden="true"
        >
          {icon}
        </span>
      )}

      <span>{children}</span>

      {badge !== undefined && (
        <span
          className={clsx(
            'ml-1 px-1.5 py-0.5 text-[11px] font-semibold rounded-full',
            isActive
              ? 'bg-primary-50 text-primary-700'
              : 'bg-neutral-100 text-neutral-600'
          )}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

Tabs.Tab = Tab;

export default Tabs;
