// src/features/admin/components/AdminStatCard.jsx
import React from 'react';
import clsx from 'clsx';
import Card from '../../../components/ui/Card';

export default function AdminStatCard({
  title,
  value,
  subvalue,
  trend,
  trendType = 'positive', // 'positive' | 'negative' | 'neutral' | 'live'
  icon: Icon,
  badgeText,
  className,
  onClick,
}) {
  const isClickable = Boolean(onClick);

  return (
    <Card
      variant={isClickable ? 'interactive' : 'default'}
      onClick={onClick}
      className={clsx(
        'relative overflow-hidden border border-neutral-200/90 bg-white p-5 transition-all duration-150',
        isClickable && 'hover:border-neutral-300 hover:shadow-xs cursor-pointer',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold tracking-tight text-neutral-900">
              {value}
            </h3>
            {trend && (
              <span
                className={clsx(
                  'text-xs font-semibold px-1.5 py-0.5 rounded-full inline-flex items-center gap-1',
                  trendType === 'positive' && 'bg-emerald-50 text-emerald-700',
                  trendType === 'negative' && 'bg-rose-50 text-rose-700',
                  trendType === 'neutral' && 'bg-neutral-100 text-neutral-600',
                  trendType === 'live' && 'bg-emerald-50 text-emerald-700'
                )}
              >
                {trendType === 'live' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                )}
                {trend}
              </span>
            )}
          </div>
          {subvalue && (
            <p className="text-xs text-neutral-400 font-normal">
              {subvalue}
            </p>
          )}
        </div>

        {Icon && (
          <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-150 text-neutral-700 shrink-0">
            <Icon className="w-5 h-5 text-neutral-600" />
          </div>
        )}
      </div>

      {badgeText && (
        <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
          <span>{badgeText}</span>
        </div>
      )}
    </Card>
  );
}
