'use client';

import { useState, useEffect } from 'react';
import {
  SidebarMenu,
  SidebarBalanceWidget,
  SidebarExchangeRatesWidget,
} from './sidebar/index';

interface MenuItem {
  id: string;
  label: string;
  href: string;
  badge?: number;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
  },
  {
    id: 'transactions',
    label: 'Transactions',
    href: '/transactions',
  },
  {
    id: 'accounts',
    label: 'Accounts',
    href: '/accounts',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/analytics',
  },
  {
    id: 'family-group',
    label: 'Family Group',
    href: '/family-group',
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
  },
];

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([
    'transactions',
  ]);

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

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        id="toggleSidebarMobile"
        className="lg:hidden fixed top-4 left-4 z-30 p-2 text-white bg-primary-600 hover:bg-primary-500 rounded-lg transition-colors duration-200"
        onClick={toggleSidebar}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <aside
        id="sidebar"
        className={`fixed top-0 left-0 z-20 w-72 h-full pt-16 duration-300 transition-transform ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 bg-white border-r border-background-200 shadow-lg`}
        aria-label="Sidebar"
      >
        <div className="h-full px-4 py-6 overflow-y-auto">
          {/* Navigation Menu */}
          <div className="mb-8">
            <SidebarMenu
              items={menuItems}
              expandedItems={expandedItems}
              onToggleExpanded={toggleExpanded}
            />
          </div>

          {/* Exchange Rates Widget */}
          <div className="mb-6">
            <SidebarExchangeRatesWidget compact={true} />
          </div>

          {/* Account Summary */}
          <div className="mb-6">
            <SidebarBalanceWidget />
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
