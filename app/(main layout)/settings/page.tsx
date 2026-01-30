'use client';

import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/api/auth/queries';
import { roboto } from '@/assets/fonts/fonts';
import {
  RiUserLine,
  RiShieldKeyholeLine,
  RiBankCardLine,
  RiArrowRightSLine,
} from '@remixicon/react';
import { getInitials, Button_Signout } from './profile/index';
import { useSignOut } from '@/api/auth/mutations';

interface SettingsItem {
  title: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  color: string;
}

export default function Settings() {
  const router = useRouter();
  const { user, isLoading } = useCurrentUser();
  const signOut = useSignOut();

  const handleLogout = async () => {
    try {
      await signOut.mutateAsync();
      router.push('/sign-in');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const settingsItems: SettingsItem[] = [
    {
      title: 'Profile',
      description: 'Manage your personal information, name, and profile photo',
      path: '/settings/profile',
      icon: <RiUserLine className="w-6 h-6" />,
      color:
        'bg-primary-400 text-background-100 dark:bg-background-100 dark:text-stack-600',
    },
    {
      title: 'Security',
      description: 'Update password, change email, and manage authentication',
      path: '/settings/security',
      icon: <RiShieldKeyholeLine className="w-6 h-6" />,
      color:
        'bg-primary-400 text-background-100 dark:bg-background-100 dark:text-stack-600',
    },
  ];

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-10 h-10 bg-background-200 dark:bg-background-700 rounded-full"></div>
          <p className="text-background-500 dark:text-background-400">
            Loading settings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full sm:max-w-3xl lg:max-w-4xl mx-auto min-h-[calc(100vh-4rem)] bg-linear-to-br from-background-50 to-background-100 dark:from-primary-800 dark:to-primary-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-background-100 dark:border-background-700 shadow-financial overflow-hidden box-border">
      <div className="rounded-2xl p-6 mb-8 ">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <h2 className="lg:text-xl md:text-xl sm:text-sm font-semibold text-background-800 dark:text-background-200">
              {user.name || 'User'}
            </h2>
            <p className="text-background-500 dark:text-stack-300 text-sm">
              {user.email}
            </p>
          </div>
          <div className="w-full sm:w-auto">
            <Button_Signout
              onclick={handleLogout}
              disabled={signOut.isPending}
              className="text-stack-600 dark:text-background-400 font-semibold"
              iconColor="background-400"
              iconSize="w-4 h-4 sm:w-5 sm:h-5"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {settingsItems.map((item) => (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className="w-full text-left bg-white dark:bg-stack-200 rounded-2xl border border-background-200 dark:border-background-700 p-5 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all duration-200 group flex flex-col items-start gap-4 sm:flex-row sm:items-center"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color} transition-transform group-hover:scale-105 border border-primary-400 dark:border-stack-300 shrink-0`}
            >
              {item.icon}
            </div>

            <div className="flex-1 min-w-0 w-full">
              <h3 className="text-lg font-semibold text-background-800 group-hover:text-primary-700  transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-background-500 dark:text-background-700 truncate">
                {item.description}
              </p>
            </div>

            <RiArrowRightSLine className="w-5 h-5 text-background-400 dark:text-background-700 group-hover:text-primary-700 group-hover:translate-x-1 transition-all self-start sm:self-center" />
          </button>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-xs text-background-400 dark:text-background-600">
          Family Finance App
        </p>
      </div>
    </div>
  );
}
