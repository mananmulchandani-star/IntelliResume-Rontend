import React, { useState } from 'react';
import Sidebar from './Sidebar';
import NotificationBell from '../shared/NotificationBell';
import Breadcrumbs from '../shared/Breadcrumbs';
import SearchBar from '../shared/SearchBar';
import { Menu, Search } from 'lucide-react';
import clsx from 'clsx';

export default function DashboardLayout({
  children,
  title,
  subtitle,
  breadcrumbs = [],
  actions,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Dynamic Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={clsx(
          'flex-1 flex flex-col min-w-0 transition-all duration-200 ease-in-out',
          isCollapsed ? 'lg:pl-[72px]' : 'lg:pl-64'
        )}
      >
        {/* Top Header Bar */}
        <header className="h-16 sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-neutral-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Sidebar Trigger */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 focus:outline-none"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb trail on desktop */}
            <div className="hidden sm:block truncate">
              {breadcrumbs.length > 0 ? (
                <Breadcrumbs items={breadcrumbs} />
              ) : (
                <span className="text-xs font-semibold text-neutral-800 tracking-tight">
                  {title || 'Dashboard'}
                </span>
              )}
            </div>
          </div>

          {/* Right Header Utilities: Search, Notifications, Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden md:block w-52 lg:w-64">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Quick search..."
              />
            </div>

            <NotificationBell />

            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          {/* Optional page header if title provided */}
          {(title || subtitle) && (
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/60 pb-5">
              <div>
                {title && (
                  <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="mt-1 text-xs sm:text-sm text-neutral-500">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          )}

          {children}
        </main>
      </div>
    </div>
  );
}
