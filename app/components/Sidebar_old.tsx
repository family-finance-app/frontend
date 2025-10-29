'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTransactionsOpen, setIsTransactionsOpen] = useState(false);

  // Close mobile sidebar menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest('#sidebar') &&
        !target.closest('#toggleSidebarMobile')
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  const toggleSidebar = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        id="toggleSidebarMobile"
        className="lg:hidden fixed top-4 left-4 z-30 p-2 text-gray-600 opacity-0 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100"
        onClick={toggleSidebar}
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <aside
        id="sidebar"
        className={`fixed top-0 left-0 z-20 flex flex-col flex-shrink-0 w-64 h-full pt-16 font-normal duration-300 transition-all ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:flex`}
        aria-label="Sidebar"
      >
        <div className="relative flex flex-col flex-1 min-h-0 pt-0 bg-background-50 border-r border-background-200 backdrop-blur-sm">
          <div className="flex flex-col flex-1 pt-5 pb-28 overflow-y-auto">
            <div className="flex-1 px-3 space-y-1 bg-background-50 divide-y divide-background-200">
              <ul className="pb-2 space-y-2">
                <li>
                  <Link
                    href="/"
                    className="flex items-center p-4 text-base text-background-800 rounded-xl hover:bg-background-100 group transition-all duration-200 hover:scale-105"
                  >
                    <span className="font-medium">Dashboard</span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/family-group"
                    className="flex items-center p-4 text-base text-background-800 rounded-xl hover:bg-background-100 group transition-all duration-200 hover:scale-105"
                  >
                    <span className="font-medium">Family Group</span>
                  </Link>
                </li>

                <li>
                  <button
                    type="button"
                    className="flex items-center justify-between w-full p-4 text-base text-background-800 transition-all duration-200 rounded-xl group hover:bg-background-100 hover:scale-105"
                    onClick={() => setIsTransactionsOpen(!isTransactionsOpen)}
                  >
                    <span className="font-medium text-left">Transactions</span>
                    <svg
                      className={`w-5 h-5 transition-transform duration-200 ${
                        isTransactionsOpen ? 'rotate-180' : ''
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {isTransactionsOpen && (
                    <ul className="py-2 space-y-2 animate-fade-in">
                      <li>
                        <Link
                          href="/my-transactions"
                          className="flex items-center p-3 text-sm text-background-700 transition-all duration-200 rounded-lg ml-6 group hover:bg-background-100 hover:scale-105"
                        >
                          My Transactions
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/family-transactions"
                          className="flex items-center p-3 text-sm text-background-700 transition-all duration-200 rounded-lg ml-6 group hover:bg-background-100 hover:scale-105"
                        >
                          Family Transactions
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>

                <li>
                  <Link
                    href="/settings"
                    className="flex items-center p-4 text-base text-background-800 rounded-xl hover:bg-background-100 group transition-all duration-200 hover:scale-105"
                  >
                    <span className="font-medium">Settings</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </aside>

              <div className="pt-2 space-y-2">
                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center p-2 text-base text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  <svg
                    aria-hidden="true"
                    className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 496 512"
                  >
                    <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
                  </svg>
                  <span className="ml-3">Empty</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-10 bg-gray-900/50 dark:bg-gray-900/90 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
