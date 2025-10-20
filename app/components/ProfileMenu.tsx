'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import defaultUserIcon from 'public/icons/unknown-user.svg';
import userIcon from 'public/icons/authenticated-user.svg';

import { useCurrentUser } from '@/api/auth/queries';
import { useSignOut } from '@/api/auth/mutations';

export default function ProfileMenu() {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { data: user } = useCurrentUser();
  const signOut = useSignOut();

  const isAuthenticated = !!user;

  const handleSignOut = async () => {
    try {
      await signOut.mutateAsync();
      setIsProfileOpen(false);
      router.push('/sign-in');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  // close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (!target.closest('[data-dropdown="profile"]')) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      <div className="flex items-center ml-3 relative" data-dropdown="profile">
        <button
          type="button"
          className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
          onClick={() => setIsProfileOpen(!isProfileOpen)}
        >
          <span className="sr-only">Open user menu</span>

          <Image
            src={isAuthenticated ? userIcon : defaultUserIcon}
            alt="User Icon"
            className="w-8 h-8"
            width={32}
            height={32}
          />
        </button>

        {/* Profile Dropdown Menu */}
        {isProfileOpen && (
          <div className="absolute right-0 top-10 z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600">
            {isAuthenticated ? (
              <>
                <div className="px-4 py-3">
                  <p className="text-sm text-gray-900 dark:text-white">
                    {user.email}
                  </p>
                  <p className="text-sm font-medium text-gray-500 truncate dark:text-gray-400">
                    {user.role}
                  </p>
                </div>
                <ul className="py-1">
                  <li>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Settings
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      disabled={signOut.isPending}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white disabled:opacity-50"
                    >
                      {signOut.isPending ? 'Signing out...' : 'Sign out'}
                    </button>
                  </li>
                </ul>
              </>
            ) : (
              <ul className="py-1">
                <li>
                  <Link
                    href="/sign-in"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sign-up"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Sign Up
                  </Link>
                </li>
              </ul>
            )}
          </div>
        )}
      </div>
    </>
  );
}
