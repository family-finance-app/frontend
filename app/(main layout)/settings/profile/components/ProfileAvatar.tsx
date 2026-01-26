'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

import {
  RiAccountCircleFill,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiLockFill,
} from '@remixicon/react';

import { useCurrentUser } from '@/api/auth/queries';
import { useSignOut } from '@/api/auth/mutations';

import { getInitials } from '../index';

import Button_signout from './Button_signout';

export default function ProfileAvatar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useCurrentUser();
  const signOut = useSignOut();
  const router = useRouter();

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
        <div className="w-8 h-8 rounded-full flex items-center justify-center">
          <RiAccountCircleFill className="text-primary-400 w-8 h-8" />
        </div>
        <span className="text-sm font-medium text-background-100">Sign in</span>
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
            <RiAccountCircleFill className="text-primary-400 w-8 h-8" />
          )}
        </div>
        <span className="text-sm font-medium">
          {hasName ? user?.name : user?.email}
        </span>
        {isDropdownOpen ? (
          <RiArrowUpSLine className="text-background-200" />
        ) : (
          <RiArrowDownSLine className="text-background-200" />
        )}
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <button
            onClick={() => handleMenuClick('/settings/profile')}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
          >
            <RiAccountCircleFill className="text-primary-500" />
            <span>Profile</span>
          </button>

          <button
            onClick={() => handleMenuClick('/settings/security')}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
          >
            <RiLockFill className="text-primary-500" />
            <span>Security</span>
          </button>

          <hr className="my-1" />

          <Button_signout
            onclick={handleLogout}
            disabled={signOut.isPending}
            iconSize="w-4 h-4"
          />
        </div>
      )}
    </div>
  );
}
