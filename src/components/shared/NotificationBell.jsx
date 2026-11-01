import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';
import clsx from 'clsx';

export default function NotificationBell({ className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Resume ATS Analysis Complete',
      message: 'Your Software Engineer resume scored 88/100.',
      time: '10m ago',
      read: false,
      type: 'success',
    },
    {
      id: '2',
      title: 'New Campus Drive Posted',
      message: 'Google has opened registration for Fall 2026 Batch.',
      time: '1h ago',
      read: false,
      type: 'info',
    },
    {
      id: '3',
      title: 'Interview Scheduled',
      message: 'Round 1 technical interview confirmed for tomorrow at 2:00 PM.',
      time: '4h ago',
      read: true,
      type: 'warning',
    },
  ]);

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className={clsx('relative', className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-600 rounded-full ring-2 ring-white animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-50 animate-scale-in">
          <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-100">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-neutral-900">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold bg-primary-50 text-primary-600 px-1.5 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2 text-xs">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-primary-600 hover:text-primary-700 flex items-center gap-1 font-medium"
                >
                  <Check className="w-3.5 h-3.5" /> Mark read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-neutral-400 hover:text-red-600 transition-colors"
                  title="Clear all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-neutral-100 scrollbar-thin">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-neutral-400">
                No notifications right now
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={clsx(
                    'px-4 py-3 hover:bg-neutral-50 transition-colors cursor-pointer text-left',
                    !n.read && 'bg-primary-50/30'
                  )}
                  onClick={() =>
                    setNotifications((prev) =>
                      prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
                    )
                  }
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className={clsx('text-xs font-semibold', !n.read ? 'text-neutral-900' : 'text-neutral-700')}>
                      {n.title}
                    </p>
                    <span className="text-[10px] text-neutral-400 shrink-0">{n.time}</span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
