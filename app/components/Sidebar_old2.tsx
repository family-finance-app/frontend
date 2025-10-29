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
        className="lg:hidden fixed top-4 left-4 z-30 p-3 text-background-600 rounded-xl cursor-pointer hover:text-background-900 hover:bg-background-100 transition-all duration-200"
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
            <div className="flex-1 px-3 space-y-1 bg-background-50">
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

      {/* Backdrop for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-10 bg-background-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
