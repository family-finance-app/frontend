'use client';

import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/api/auth/queries';
import { roboto } from '@/assets/fonts/fonts';
import Button from '@/components/ui/Button_financial';

interface SettingsItem {
  title: string;
  description: string;
  path: string;
}

export default function Settings() {
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();

  const settingsItems: SettingsItem[] = [
    {
      title: 'Profile',
      description: 'Manage your personal information and profile photo',
      path: '/settings/profile',
    },
    {
      title: 'Security',
      description: 'Change password and email, manage authentication',
      path: '/settings/security',
    },
    {
      title: 'Accounts',
      description: 'Manage your financial accounts and transactions',
      path: '/settings/accounts',
    },
  ];

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-background-500">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1
          className={`${roboto.className} text-3xl font-bold text-background-900 mb-2`}
        >
          Settings
        </h1>
        <p className="text-background-600">
          Manage your account and application preferences
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {settingsItems.map((item) => (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className="text-left bg-white rounded-2xl shadow-financial border border-background-100 p-6 hover:shadow-lg hover:border-primary-300 transition-all group"
          >
            <h3 className="text-lg font-bold text-background-900 mb-1 group-hover:text-primary-600 transition-colors">
              {item.title}
            </h3>
            <p className="text-sm text-background-600">{item.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
