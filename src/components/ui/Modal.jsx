import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { X } from 'lucide-react';

/**
 * Modal component for dialogs and overlay interactions.
 *
 * @typedef {'sm' | 'md' | 'lg' | 'xl'} ModalSize
 *
 * @typedef {Object} ModalProps
 * @property {boolean} isOpen - Controls visibility of the modal
 * @property {() => void} onClose - Callback invoked when close requested
 * @property {string} [title] - Optional title in the header
 * @property {string} [description] - Optional subtitle/description text
 * @property {ModalSize} [size='md'] - Modal width size
 * @property {boolean} [showCloseButton=true] - Shows X button in top right
 * @property {boolean} [closeOnOverlayClick=true] - Whether clicking backdrop closes modal
 * @property {boolean} [closeOnEscape=true] - Whether pressing Escape closes modal
 * @property {React.ReactNode} children - Modal content or composable subcomponents
 * @property {string} [className] - Additional class names for modal container
 */

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

export const ModalHeader = ({ children, className, onClose, showCloseButton = false }) => (
  <div
    className={clsx(
      'flex items-center justify-between px-6 py-4 border-b border-neutral-200 shrink-0',
      className
    )}
  >
    <div className="flex flex-col gap-0.5">{children}</div>
    {showCloseButton && onClose && (
      <button
        type="button"
        onClick={onClose}
        aria-label="Close dialog"
        className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 p-1.5 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <X size={18} />
      </button>
    )}
  </div>
);

export const ModalBody = ({ children, className }) => (
  <div className={clsx('px-6 py-5 overflow-y-auto max-h-[calc(85vh-130px)]', className)}>
    {children}
  </div>
);

export const ModalFooter = ({ children, className }) => (
  <div
    className={clsx(
      'flex items-center justify-end gap-3 px-6 py-4 bg-neutral-50/75 border-t border-neutral-200 rounded-b-lg shrink-0',
      className
    )}
  >
    {children}
  </div>
);

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  children,
  className,
}) {
  const modalRef = useRef(null);
  const previouslyFocusedElement = useRef(null);

  // Handle ESC key
  const handleKeyDown = useCallback(
    (e) => {
      if (closeOnEscape && e.key === 'Escape') {
        e.stopPropagation();
        onClose?.();
      }
    },
    [closeOnEscape, onClose]
  );

  // Manage body scroll and focus retention
  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedElement.current = document.activeElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus modal
    modalRef.current?.focus();

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocusedElement.current?.focus) {
        previouslyFocusedElement.current.focus();
      }
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  // Render using portal to document.body
  const content = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-description' : undefined}
    >
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal Dialog Box */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className={clsx(
          'relative w-full bg-white rounded-lg border border-neutral-200 shadow-modal z-10 my-8 overflow-hidden',
          'animate-scale-in focus:outline-none',
          sizeStyles[size] || sizeStyles.md,
          className
        )}
      >
        {/* Header if title is provided */}
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-neutral-100">
            <div>
              {title && (
                <h3
                  id="modal-title"
                  className="text-lg font-semibold text-neutral-900 leading-snug"
                >
                  {title}
                </h3>
              )}
              {description && (
                <p
                  id="modal-description"
                  className="text-sm text-neutral-500 mt-1"
                >
                  {description}
                </p>
              )}
            </div>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 p-1.5 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 -mr-2 -mt-1"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        {children}
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(content, document.body)
    : null;
}

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;
