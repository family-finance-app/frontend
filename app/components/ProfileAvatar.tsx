'use client';

import Link from 'next/link';
import { useCurrentUser } from '@/api/auth/queries';

export default function ProfileAvatar() {
  const { data: user } = useCurrentUser();

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return '';
    const first = firstName?.charAt(0).toUpperCase() || '';
    const last = lastName?.charAt(0).toUpperCase() || '';
    return first + last;
  };

  const isAuthenticated = !!user;
  const hasName = user?.firstName || user?.lastName;
  const initials = getInitials(user?.firstName, user?.lastName);

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
    <Link
      href="/settings/profile"
      className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
    >
      <div className="w-8 h-8 rounded-full bg-primary-600 border-2 border-primary-400 flex items-center justify-center text-white font-medium text-sm">
        {hasName && initials ? (
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
        {hasName
          ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
          : user.email}
      </span>
    </Link>
  );
}
