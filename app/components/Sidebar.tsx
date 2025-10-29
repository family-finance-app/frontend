'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { roboto } from '../assets/fonts/fonts';

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
    children: [
      {
        id: 'my-transactions',
        label: 'My Transactions',
        href: '/my-transactions',
      },
      {
        id: 'family-transactions',
        label: 'Family Transactions',
        href: '/family-transactions',
      },
    ],
  },
  {
    id: 'accounts',
    label: 'Accounts',
    href: '/accounts',
  },
  {
    id: 'reports',
    label: 'Analytics',
    href: '/reports',
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
  const pathname = usePathname();

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

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const active = isActive(item.href);

    return (
      <li key={item.id} className={level === 0 ? 'mb-1' : 'mb-0'}>
        {hasChildren ? (
          <button
            type="button"
            className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 group ${
              active
                ? 'bg-primary-100 text-primary-800 shadow-sm'
                : 'text-background-700 hover:bg-background-100 hover:text-background-900'
            } ${level > 0 ? 'ml-4 text-sm' : 'text-base font-medium'}`}
            onClick={() => toggleExpanded(item.id)}
          >
            <span className="flex items-center space-x-3">
              <span>{item.label}</span>
              {item.badge && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary-500 rounded-full">
                  {item.badge}
                </span>
              )}
            </span>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        ) : (
          <Link
            href={item.href}
            className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 group ${
              active
                ? 'bg-primary-100 text-primary-800 shadow-sm border-l-4 border-primary-500'
                : 'text-background-700 hover:bg-background-100 hover:text-background-900'
            } ${level > 0 ? 'ml-4 text-sm' : 'text-base font-medium'}`}
          >
            <span>{item.label}</span>
            {item.badge && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary-500 rounded-full">
                {item.badge}
              </span>
            )}
          </Link>
        )}

        {hasChildren && isExpanded && (
          <ul className="mt-2 space-y-1 animate-fade-in">
            {item.children!.map((child) => renderMenuItem(child, level + 1))}
          </ul>
        )}
      </li>
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
            <nav>
              <ul className="space-y-1">
                {menuItems.map((item) => renderMenuItem(item))}
              </ul>
            </nav>
          </div>

          {/* Account Summary */}
          <div className="mb-6">
            <div className="bg-background-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-background-600">
                  Total Balance
                </span>
                <span className="font-mono font-semibold text-background-900">
                  $12,450.00
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-background-600">This Month</span>
                <span className="font-mono font-semibold text-success-600">
                  +$342.50
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-background-600">Budget Left</span>
                <span className="font-mono font-semibold text-warning-600">
                  $1,205.30
                </span>
              </div>
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
