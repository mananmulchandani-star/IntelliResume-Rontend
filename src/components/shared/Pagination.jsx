import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import Button from '../ui/Button';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalItems,
  pageSize = 10,
  className = '',
}) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems || totalPages * pageSize);

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div className={clsx('flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-neutral-600 py-3', className)}>
      {totalItems !== undefined && (
        <span className="text-xs text-neutral-500">
          Showing <span className="font-semibold text-neutral-900">{startItem}</span> to{' '}
          <span className="font-semibold text-neutral-900">{endItem}</span> of{' '}
          <span className="font-semibold text-neutral-900">{totalItems}</span> results
        </span>
      )}
      <div className="flex items-center space-x-1">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="!p-1.5"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        {pages.map((p, idx) =>
          p === '...' ? (
            <span key={`dots-${idx}`} className="px-2 text-neutral-400">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={clsx(
                'w-8 h-8 rounded-md text-xs font-medium transition-colors flex items-center justify-center',
                currentPage === p
                  ? 'bg-primary-600 text-white font-semibold'
                  : 'hover:bg-neutral-100 text-neutral-700'
              )}
            >
              {p}
            </button>
          )
        )}
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="!p-1.5"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
