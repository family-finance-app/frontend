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
import { getInitials } from '@/utils/uiUtils';
import { useSignOut } from '@/api/auth/mutations';
import { Button_signout } from '@/components/ui/Button_signout';

interface SettingsItem {
  title: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  color: string;
}

export default function Settings() {
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();
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
    {
      title: 'Accounts',
      description: 'Manage your financial accounts, cards, and wallets',
      path: '/settings/accounts',
      icon: <RiBankCardLine className="w-6 h-6" />,
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
    <div className="min-h-screen bg-linear-to-br from-background-50 to-background-100 dark:from-primary-800 dark:to-primary-800 rounded-3xl p-6 md:p-8">
      {/* Header */}
      <div className="mb-10">
        <h1
          className={`${roboto.variable} text-4xl md:text-5xl font-bold text-primary-800 dark:text-background-100 mb-3 font-roboto`}
        >
          Settings
        </h1>
        <p className="text-primary-800 dark:text-background-300 text-lg">
          Manage your account preferences and configurations
        </p>
      </div>

      {/* User Info Card */}
      <div className="bg-white dark:bg-background-200 rounded-2xl p-6 mb-8 border border-background-200 dark:border-background-800 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-linear-to-br from-primary-400 to-primary-600 dark:from-primary-600 dark:to-primary-800 flex items-center justify-center text-white dark:text-background-100 text-xl font-bold shadow-lg">
            {getInitials(user.name)}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-background-800 dark:text-stack-800">
              {user.name || 'User'}
            </h2>
            <p className="text-background-500 dark:text-stack-700 text-sm">
              {user.email}
            </p>
          </div>
          <div className="">
            <Button_signout
              onclick={handleLogout}
              disabled={signOut.isPending}
              className="text-primary-800 font-bold"
              iconColor="primary-800"
            />
          </div>
        </div>
      </div>

      {/* Settings List */}
      <div className="space-y-3">
        {settingsItems.map((item) => (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className="w-full text-left bg-white dark:bg-stack-200 rounded-2xl border border-background-200 dark:border-background-700 p-5 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all duration-200 group flex items-center gap-4"
          >
            {/* Icon */}
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color} transition-transform group-hover:scale-105 border border-primary-400 dark:border-stack-300`}
            >
              {item.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-background-800 group-hover:text-primary-700  transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-background-500 dark:text-background-700 truncate">
                {item.description}
              </p>
            </div>

            {/* Arrow */}
            <RiArrowRightSLine className="w-5 h-5 text-background-400 dark:text-background-700 group-hover:text-primary-700 group-hover:translate-x-1 transition-all" />
          </button>
        ))}
      </div>

      {/* App Version */}
      <div className="mt-12 text-center">
        <p className="text-xs text-background-400 dark:text-background-600">
          Family Finance App • Version 1.0.0
        </p>
      </div>
    </div>
  );
}
