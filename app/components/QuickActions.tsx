'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function QuickActions() {
  const [isAppsOpen, setIsAppsOpen] = useState(false);

  // close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (!target.closest('[data-dropdown="apps"]')) {
        setIsAppsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      <div className="relative hidden sm:block" data-dropdown="apps">
        <button
          type="button"
          className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
          onClick={() => setIsAppsOpen(!isAppsOpen)}
        >
          <span className="sr-only">View apps</span>
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>

        {/* Apps Dropdown Menu */}
        {isAppsOpen && (
          <div className="absolute right-0 z-20 w-64 mt-2 overflow-hidden text-base list-none bg-white divide-y divide-gray-100 rounded shadow-lg dark:bg-gray-700 dark:divide-gray-600">
            <div className="block px-4 py-2 text-base font-medium text-center text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              Quick Actions
            </div>
            <div className="grid grid-cols-3 gap-4 p-4">
              <Link
                href="/transactions/new"
                className="block p-4 text-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <svg
                  className="mx-auto mb-1 text-gray-500 w-7 h-7 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Add Transaction
                </div>
              </Link>

              <Link
                href="/budgets"
                className="block p-4 text-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <svg
                  className="mx-auto mb-1 text-gray-500 w-7 h-7 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                </svg>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Budgets
                </div>
              </Link>

              <Link
                href="/reports"
                className="block p-4 text-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <svg
                  className="mx-auto mb-1 text-gray-500 w-7 h-7 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 001.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Reports
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
