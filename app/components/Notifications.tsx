'use client';

import { useState, useEffect, useRef } from 'react';
import { RiNotification4Line, RiNotificationOffFill } from '@remixicon/react';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
}

export default function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white/80 hover:text-white hover:bg-primary-600 rounded-lg transition-colors duration-200 dark:text-background-300 dark:hover:text-white dark:hover:bg-primary-500"
      >
        <RiNotification4Line />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-0 top-full mt-2 w-[calc(100vw-2rem)] max-w-sm sm:max-w-none sm:w-80 bg-white dark:bg-primary-800 rounded-2xl shadow-2xl border border-background-100 dark:border-background-700 z-50 animate-scale-in">
            <div className="p-4 border-b border-background-100 dark:border-background-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-primary-800 dark:text-background-100">
                  Notifications
                </h3>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              <div className="p-8 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-background-100 dark:bg-primary-500 rounded-full flex items-center justify-center">
                  <RiNotificationOffFill className="dark:text-background-300" />
                </div>
                <p className="text-background-600 dark:text-background-300 text-sm">
                  This feature is coming soon
                </p>
              </div>
            </div>

            {/* <div className="p-4 border-t border-background-100 dark:border-background-700">
              <button className="w-full text-sm text-primary-600 dark:text-background-200 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors">
                View all notifications
              </button>
            </div> */}
          </div>
        </>
      )}
    </div>
  );
}
