import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import clsx from 'clsx';

export default function SearchBar({
  value = '',
  onChange,
  placeholder = 'Search...',
  className = '',
  onClear,
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={clsx(
        'relative flex items-center w-full transition-all duration-150 rounded-lg border bg-white',
        isFocused ? 'border-primary-500 ring-2 ring-primary-100 shadow-xs' : 'border-neutral-200 hover:border-neutral-300',
        className
      )}
    >
      <Search className="w-4 h-4 ml-3 text-neutral-400 shrink-0 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="w-full py-2 pl-2.5 pr-8 text-xs text-neutral-900 placeholder:text-neutral-400 bg-transparent rounded-lg focus:outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange?.('');
            onClear?.();
          }}
          className="absolute right-2.5 text-neutral-400 hover:text-neutral-600 transition-colors"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
