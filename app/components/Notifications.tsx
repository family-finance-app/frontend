'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Notifications() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  // close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (!target.closest('[data-dropdown="notification"]')) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      <div className="relative" data-dropdown="notification">
        <button
          type="button"
          className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
          onClick={() => setIsNotificationOpen(!isNotificationOpen)}
        >
          <span className="sr-only">View notifications</span>
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
        </button>

        {/* Notification Dropdown */}
        {isNotificationOpen && (
          <div className="absolute right-0 z-20 w-80 mt-2 overflow-hidden text-base list-none bg-white divide-y divide-gray-100 rounded shadow-lg dark:divide-gray-600 dark:bg-gray-700">
            <div className="block px-4 py-2 text-base font-medium text-center text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              Notifications
            </div>
            <div>
              <Link
                href="#"
                className="flex px-4 py-3 border-b hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600"
              >
                <div className="flex-shrink-0">
                  <Image
                    className="rounded-full w-11 h-11"
                    src="/images/users/profile-1.jpg"
                    alt="User avatar"
                    width={44}
                    height={44}
                  />
                </div>
                <div className="w-full pl-3">
                  <div className="text-gray-500 font-normal text-sm mb-1.5 dark:text-gray-400">
                    New transaction added:{' '}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      $250.00
                    </span>{' '}
                    for groceries
                  </div>
                  <div className="text-xs font-medium text-primary-700 dark:text-primary-400">
                    a few moments ago
                  </div>
                </div>
              </Link>

              <Link
                href="#"
                className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <div className="flex-shrink-0">
                  <Image
                    className="rounded-full w-11 h-11"
                    src="/images/users/profile-2.jpg"
                    alt="User avatar"
                    width={44}
                    height={44}
                  />
                </div>
                <div className="w-full pl-3">
                  <div className="text-gray-500 font-normal text-sm mb-1.5 dark:text-gray-400">
                    Budget alert: You spent{' '}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      85%
                    </span>{' '}
                    of your monthly budget
                  </div>
                  <div className="text-xs font-medium text-primary-700 dark:text-primary-400">
                    2 hours ago
                  </div>
                </div>
              </Link>
            </div>

            <Link
              href="/notifications"
              className="block py-2 text-base font-normal text-center text-gray-900 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:underline"
            >
              <div className="inline-flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
                View all
              </div>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
