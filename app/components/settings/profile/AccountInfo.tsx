'use client';

import { User } from '@/types/profile';
import { roboto, jetbrainsMono } from '@/assets/fonts/fonts';

interface AccountInfoProps {
  user: User;
}

export function AccountInfo({ user }: AccountInfoProps) {
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-financial border border-background-100 p-6">
      <h2
        className={`${roboto.className} text-lg font-bold text-background-900 mb-4`}
      >
        Account Information
      </h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between py-3 border-b border-background-100">
          <span className="text-background-600 font-medium">Email</span>
          <span className={`${jetbrainsMono.className} text-background-900`}>
            {user.email}
          </span>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-background-100">
          <span className="text-background-600 font-medium">User ID</span>
          <span className={`${jetbrainsMono.className} text-background-900`}>
            #{user.id}
          </span>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-background-100">
          <span className="text-background-600 font-medium">Role</span>
          <span className="inline-flex px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
            {user.role || 'User'}
          </span>
        </div>

        <div className="flex items-center justify-between py-3">
          <span className="text-background-600 font-medium">
            Account Created
          </span>
          <span className="text-background-900 text-sm">
            {formatDate(user.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
