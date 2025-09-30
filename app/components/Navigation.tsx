'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isAppsOpen, setIsAppsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (!target.closest('[data-dropdown="notification"]')) {
        setIsNotificationOpen(false);
      }
      if (!target.closest('[data-dropdown="apps"]')) {
        setIsAppsOpen(false);
      }
      if (!target.closest('[data-dropdown="profile"]')) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <nav className="fixed z-30 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            {/* Logo */}
            <Link href="/" className="flex ml-2 md:mr-24">
              <Image
                src="icons/logo-icon.svg"
                className="h-8 mr-3"
                alt="FamilyFinance Logo"
                width={32}
                height={32}
              />
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                FamilyFinance
              </span>
            </Link>

            {/* Search Input - Desktop */}
            <div className="hidden lg:block lg:pl-3.5">
              <label htmlFor="topbar-search" className="sr-only">
                Search
              </label>
              <div className="relative mt-1 lg:w-96">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  name="search"
                  id="topbar-search"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Search transactions..."
                />
              </div>
            </div>
          </div>

          <div className="flex items-center">
            {/* Mobile Search Button */}
            <button
              type="button"
              className="p-2 text-gray-500 rounded-lg lg:hidden hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            >
              <span className="sr-only">Search</span>
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Notifications */}
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

            {/* Apps Dropdown */}
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

            {/* Color Mode Switcher Placeholder */}
            <button
              type="button"
              className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            </button>

            {/* Profile Dropdown */}
            <div
              className="flex items-center ml-3 relative"
              data-dropdown="profile"
            >
              <button
                type="button"
                className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <span className="sr-only">Open user menu</span>
                <Image
                  className="w-8 h-8 rounded-full"
                  src="/favicon.ico"
                  alt="User photo"
                  width={32}
                  height={32}
                />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 top-10 z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600">
                  <div className="px-4 py-3">
                    <p className="text-sm text-gray-900 dark:text-white">
                      John Smith
                    </p>
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300">
                      john.smith@familyfinance.com
                    </p>
                  </div>
                  <ul className="py-1">
                    <li>
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Settings
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Sign out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isMobileSearchOpen && (
          <div className="lg:hidden mt-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Search transactions..."
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
