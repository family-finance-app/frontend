'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/api/auth/queries';
import { useSignOut } from '@/api/auth/mutations';

export default function ProfileAvatar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: user } = useCurrentUser();
  const signOut = useSignOut();
  const router = useRouter();

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      const words = name.trim().split(' ');
      if (words.length === 1) {
        return words[0].charAt(0).toUpperCase();
      }
      const first = words[0].charAt(0).toUpperCase();
      const last = words[words.length - 1].charAt(0).toUpperCase();
      return first + last;
    }

    if (email) {
      return email.charAt(0).toUpperCase();
    }

    return '';
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut.mutateAsync();
      setIsDropdownOpen(false);
      router.push('/sign-in');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleMenuClick = (path: string) => {
    setIsDropdownOpen(false);
    router.push(path);
  };

  const isAuthenticated = !!user;
  const hasName = !!user?.name;
  const initials = getInitials(user?.name, user?.email);

  if (!isAuthenticated) {
    return (
      <Link
        href="/sign-in"
        className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-background-600 border-2 border-background-400 flex items-center justify-center">
          <svg
            className="w-4 h-4 text-background-300"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <span className="text-sm font-medium">Sign in</span>
      </Link>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-300 rounded-lg p-1"
      >
        <div className="w-8 h-8 rounded-full bg-primary-600 border-2 border-primary-400 flex items-center justify-center text-white font-medium text-sm">
          {initials ? (
            initials
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
        <span className="text-sm font-medium">
          {hasName ? user.name : user.email}
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isDropdownOpen ? 'rotate-180' : ''
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

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <button
            onClick={() => handleMenuClick('/settings/profile')}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
          >
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>Profile</span>
          </button>

          <button
            onClick={() => handleMenuClick('/settings/security')}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
          >
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span>Security</span>
          </button>

          <hr className="my-1" />

          <button
            onClick={handleLogout}
            disabled={signOut.isPending}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {signOut.isPending ? (
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            )}
            <span>{signOut.isPending ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
