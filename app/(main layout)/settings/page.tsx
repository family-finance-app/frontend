'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/api/auth/queries';
import SettingsCard from '@/components/ui/SettingsCard';
import NotificationsCard, {
  NotificationSettings,
} from '@/components/ui/NotificaionsCard';

export default function Settings() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSaveNotifications = async (settings: NotificationSettings) => {
    try {
      // need to be replaced with actual API call
      // await apiClient.put('/api/user/notifications', settings, { token });
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Failed to save notification settings:', error);
      throw new Error('Failed to save notification settings');
    }
  };

  const handleNotificationChange = (settings: NotificationSettings) => {
    console.log('Notification settings changed:', settings);
  };

  if (!mounted) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Information */}
        <SettingsCard
          header="Profile Information"
          description="Manage your personal information and profile details"
          icon="👤"
          fields={[
            {
              label: 'Email',
              content: user?.email || 'Not set',
              type: 'text',
            },
            {
              label: 'Phone',
              content: user?.phone || 'Not set',
              type: 'text',
            },
            {
              label: 'Full Name',
              content:
                `${user?.firstName || ''} ${user?.lastName || ''}`.trim() ||
                'Not set',
              type: 'text',
            },
          ]}
          buttonText="Edit Profile"
          onButtonClick={() => alert('Edit profile functionality coming soon!')}
        />

        {/* Financial Accounts */}
        <SettingsCard
          header="Financial Accounts"
          description="View and manage your connected bank accounts and cards"
          icon="💳"
          variant="link"
          buttonText="Manage Accounts"
          onButtonClick={() => router.push('/settings/accounts')}
        />

        {/* Security */}
        <SettingsCard
          header="Security"
          description="Protect your account with password and two-factor authentication"
          icon="🔒"
          fields={[
            {
              label: 'Password',
              content: 'Change',
              onClick: () =>
                alert('Change password functionality coming soon!'),
              type: 'button',
            },
            {
              label: 'Two-Factor Authentication',
              content: 'Not enabled',
              type: 'badge',
            },
          ]}
          showButton={false}
        />

        {/* Notifications */}
        <NotificationsCard
          initialSettings={{
            emailNotifications: true,
            transactionAlerts: true,
            monthlyReports: false,
            budgetAlerts: true,
            weeklyDigest: false,
          }}
          onSave={handleSaveNotifications}
          onChange={handleNotificationChange}
          showSaveButton={true}
        />

        {/* Preferences */}
        <SettingsCard
          header="Preferences"
          description="Customize your app experience"
          icon="🎨"
          buttonText="Save Preferences"
          onButtonClick={() =>
            alert('Save preferences functionality coming soon!')
          }
        >
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 block mb-2">
                Language
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                <option value="en">English</option>
                <option value="uk">Українська</option>
              </select>
            </div>
          </div>
        </SettingsCard>

        {/* Family Group */}
        <SettingsCard
          header="Family Group"
          description="Manage family members and permissions"
          icon="👨‍👩‍👧‍👦"
          variant="link"
          buttonText="Manage Family"
          onButtonClick={() => router.push('/family-group')}
        />
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-900 dark:text-red-400 mb-2">
          Danger Zone
        </h3>
        <p className="text-sm text-red-700 dark:text-red-300 mb-4">
          Irreversible actions that will affect your account permanently
        </p>
        <button
          type="button"
          onClick={() => {
            if (
              confirm(
                'Are you sure you want to delete your account? This action cannot be undone.'
              )
            ) {
              alert('Delete account functionality coming soon!');
            }
          }}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
