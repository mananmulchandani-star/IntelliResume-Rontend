import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import clsx from 'clsx';

/**
 * Dropdown menu system for action menus and selection popups.
 */

const DropdownContext = createContext(null);

export function Dropdown({ children, className }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        close();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, close]);

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen, toggle, close }}>
      <div
        ref={containerRef}
        className={clsx('relative inline-block text-left', className)}
      >
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

export function DropdownTrigger({ children, asChild = false, className, ...props }) {
  const { toggle, isOpen } = useContext(DropdownContext);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: (e) => {
        children.props.onClick?.(e);
        toggle();
      },
      'aria-haspopup': 'menu',
      'aria-expanded': isOpen,
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-haspopup="menu"
      aria-expanded={isOpen}
      className={clsx('inline-flex items-center justify-center', className)}
      {...props}
    >
      {children}
    </button>
  );
}

const placementStyles = {
  'bottom-left': 'left-0 top-full mt-1.5 origin-top-left',
  'bottom-right': 'right-0 top-full mt-1.5 origin-top-right',
  'top-left': 'left-0 bottom-full mb-1.5 origin-bottom-left',
  'top-right': 'right-0 bottom-full mb-1.5 origin-bottom-right',
};

export function DropdownMenu({
  children,
  placement = 'bottom-right',
  className,
  ...props
}) {
  const { isOpen, close } = useContext(DropdownContext);
  const menuRef = useRef(null);

  // Keyboard navigation up and down menu items
  const handleKeyDown = (e) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End', 'Tab'].includes(e.key)) return;

    const items = Array.from(
      menuRef.current?.querySelectorAll(
        '[role="menuitem"]:not([aria-disabled="true"]):not([disabled])'
      ) || []
    );
    if (!items.length) return;

    const activeIndex = items.findIndex((item) => item === document.activeElement);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = activeIndex + 1 >= items.length ? 0 : activeIndex + 1;
      items[nextIndex]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = activeIndex - 1 < 0 ? items.length - 1 : activeIndex - 1;
      items[prevIndex]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      items[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      items[items.length - 1]?.focus();
    } else if (e.key === 'Tab') {
      close();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      role="menu"
      tabIndex={-1}
      aria-orientation="vertical"
      onKeyDown={handleKeyDown}
      className={clsx(
        'absolute z-50 min-w-[190px] p-1 bg-white rounded-md border border-neutral-200 shadow-md',
        'animate-scale-in focus:outline-none',
        placementStyles[placement] || placementStyles['bottom-right'],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownItem({
  children,
  icon,
  shortcut,
  danger = false,
  disabled = false,
  onClick,
  className,
  ...props
}) {
  const { close } = useContext(DropdownContext);

  const handleClick = (e) => {
    if (disabled) return;
    onClick?.(e);
    close();
  };

  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      aria-disabled={disabled}
      onClick={handleClick}
      className={clsx(
        'w-full flex items-center justify-between px-2.5 py-1.5 text-sm rounded-sm text-left font-normal select-none transition-colors duration-100',
        'focus:outline-none',
        danger
          ? 'text-error-600 hover:bg-error-50 hover:text-error-700 focus:bg-error-50 focus:text-error-700'
          : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 focus:bg-neutral-100 focus:text-neutral-900',
        disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        {icon && (
          <span
            className={clsx(
              'shrink-0',
              danger ? 'text-error-500' : 'text-neutral-400 group-hover:text-neutral-600'
            )}
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
        <span>{children}</span>
      </div>

      {shortcut && (
        <span className="text-xs text-neutral-400 font-mono tracking-wider ml-3">
          {shortcut}
        </span>
      )}
    </button>
  );
}

export function DropdownSeparator({ className, ...props }) {
  return (
    <div
      role="separator"
      className={clsx('h-px my-1 bg-neutral-200 -mx-1', className)}
      {...props}
    />
  );
}

export function DropdownLabel({ children, className, ...props }) {
  return (
    <div
      className={clsx(
        'px-2.5 py-1.5 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider select-none',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

Dropdown.Trigger = DropdownTrigger;
Dropdown.Menu = DropdownMenu;
Dropdown.Item = DropdownItem;
Dropdown.Separator = DropdownSeparator;
Dropdown.Label = DropdownLabel;

export default Dropdown;
