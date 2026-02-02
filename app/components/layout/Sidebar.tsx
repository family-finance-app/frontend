'use client';

import { useState, useEffect } from 'react';

import {
  SidebarMenu,
  SidebarBalanceWidget,
  SidebarExchangeRatesWidget,
} from './index';

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

  useEffect(() => {
    const handleToggle = () => {
      setIsMobileMenuOpen((prev) => !prev);
    };

    window.addEventListener('toggleSidebar', handleToggle);
    return () => window.removeEventListener('toggleSidebar', handleToggle);
  }, []);

  const toggleSidebar = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuNavigate = () => {
    setIsMobileMenuOpen(false);
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
      <aside
        id="sidebar"
        className={`fixed top-0 left-0 z-20 w-72 max-w-[90vw] h-full pt-16 duration-300 transition-transform ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 bg-white border-r dark:bg-primary-800 border-background-200 dark:border-background-700 shadow-lg`}
        aria-label="Sidebar"
      >
        <div className="h-full px-4 py-6 overflow-y-auto">
          <div className="mb-8">
            <SidebarMenu
              items={menuItems}
              expandedItems={expandedItems}
              onToggleExpanded={toggleExpanded}
              onNavigate={handleMenuNavigate}
            />
          </div>

          <div className="mb-6">
            <SidebarExchangeRatesWidget compact={true} />
          </div>

          <div className="mb-6">
            <SidebarBalanceWidget />
          </div>
        </div>
      </aside>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-10 bg-background-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
