'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MenuItem {
  id: string;
  label: string;
  href: string;
  badge?: number;
  children?: MenuItem[];
}

interface SidebarMenuProps {
  items: MenuItem[];
  expandedItems: string[];
  onToggleExpanded: (itemId: string) => void;
}

/**
 * Sidebar Menu Component
 * Renders navigation menu with support for nested items and badges
 */
export function SidebarMenu({
  items,
  expandedItems,
  onToggleExpanded,
}: SidebarMenuProps) {
  const pathname = usePathname();

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
            onClick={() => onToggleExpanded(item.id)}
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
    <nav>
      <ul className="space-y-1">{items.map((item) => renderMenuItem(item))}</ul>
    </nav>
  );
}
