'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/api/auth/queries';
import { roboto } from '@/assets/fonts/fonts';
import { SettingsSection, DangerZone } from '@/components/settings';
import {
  NotificationSettings,
  SettingSection as SettingSectionType,
  getInitialNotificationSettings,
  getNotificationStatusText,
  LANGUAGE_OPTIONS,
  CURRENCY_OPTIONS,
  DATE_FORMAT_OPTIONS,
  THEME_OPTIONS,
} from '@/utils/settings';

export default function Settings() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const [mounted, setMounted] = useState(false);
  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>(getInitialNotificationSettings());

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNotificationToggle = (key: keyof NotificationSettings) => {
    setNotificationSettings((prev: NotificationSettings) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleDeleteAccount = () => {
    if (
      confirm(
        'Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data.'
      )
    ) {
      alert('Delete account functionality coming soon!');
    }
  };

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-background-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="h-48 bg-background-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const settingSections: SettingSectionType[] = [
    {
      title: 'Profile Information',
      description: 'Manage your personal details and account information',
      icon: '👤',
      items: [
        {
          label: 'Email Address',
          value: user?.email || 'Not set',
          type: 'display',
        },
        {
          label: 'Phone Number',
          value: user?.phone || 'Not set',
          type: 'display',
        },
        {
          label: 'Full Name',
          value:
            `${user?.firstName || ''} ${user?.lastName || ''}`.trim() ||
            'Not set',
          type: 'display',
        },
      ],
      primaryAction: {
        label: 'Edit Profile',
        action: () => router.push('/settings/profile'),
        variant: 'outline',
      },
    },
    {
      title: 'Security & Authentication',
      description: 'Protect your account with advanced security features',
      icon: '🔒',
      items: [
        {
          label: 'Password',
          value: 'Last changed 3 months ago',
          actionLabel: 'Change',
          action: () => alert('Change password functionality coming soon!'),
          type: 'action',
        },
        {
          label: 'Two-Factor Authentication',
          value: 'Disabled',
          description: 'Add an extra layer of security to your account',
          actionLabel: 'Enable',
          action: () => alert('2FA setup coming soon!'),
          type: 'action',
        },
        {
          label: 'Login Sessions',
          value: '3 active sessions',
          actionLabel: 'Manage',
          action: () => alert('Session management coming soon!'),
          type: 'action',
        },
      ],
    },
    {
      title: 'Financial Accounts',
      description: 'Connect and manage your bank accounts and cards',
      icon: '💳',
      items: [
        {
          label: 'Connected Accounts',
          value: '3 accounts',
          description: 'Bank accounts, credit cards, and investment accounts',
          type: 'display',
        },
        {
          label: 'Data Sync',
          value: 'Last synced 2 hours ago',
          actionLabel: 'Sync Now',
          action: () => alert('Sync functionality coming soon!'),
          type: 'action',
        },
      ],
      primaryAction: {
        label: 'Manage Accounts',
        action: () => router.push('/settings/accounts'),
        variant: 'primary',
      },
    },
    {
      title: 'Notifications',
      description: 'Control how and when you receive notifications',
      icon: '🔔',
      items: [
        {
          label: 'Email Notifications',
          value: getNotificationStatusText(
            notificationSettings.emailNotifications
          ),
          type: 'toggle',
          enabled: notificationSettings.emailNotifications,
          action: () => handleNotificationToggle('emailNotifications'),
        },
        {
          label: 'Transaction Alerts',
          value: getNotificationStatusText(
            notificationSettings.transactionAlerts
          ),
          description: 'Get notified of new transactions',
          type: 'toggle',
          enabled: notificationSettings.transactionAlerts,
          action: () => handleNotificationToggle('transactionAlerts'),
        },
        {
          label: 'Monthly Reports',
          value: getNotificationStatusText(notificationSettings.monthlyReports),
          type: 'toggle',
          enabled: notificationSettings.monthlyReports,
          action: () => handleNotificationToggle('monthlyReports'),
        },
        {
          label: 'Budget Alerts',
          value: getNotificationStatusText(notificationSettings.budgetAlerts),
          description: 'Alerts when approaching budget limits',
          type: 'toggle',
          enabled: notificationSettings.budgetAlerts,
          action: () => handleNotificationToggle('budgetAlerts'),
        },
      ],
    },
    {
      title: 'Application Preferences',
      description: 'Customize your app experience and display options',
      icon: '⚙️',
      items: [
        {
          label: 'Language',
          value: 'English',
          type: 'select',
          options: Array.from(LANGUAGE_OPTIONS),
        },
        {
          label: 'Currency',
          value: 'USD ($)',
          type: 'select',
          options: Array.from(CURRENCY_OPTIONS),
        },
        {
          label: 'Date Format',
          value: 'MM/DD/YYYY',
          type: 'select',
          options: Array.from(DATE_FORMAT_OPTIONS),
        },
        {
          label: 'Theme',
          value: 'System',
          type: 'select',
          options: Array.from(THEME_OPTIONS),
        },
      ],
    },
    {
      title: 'Family Management',
      description: 'Manage family members and their access permissions',
      icon: '👨‍👩‍👧‍👦',
      items: [
        {
          label: 'Family Members',
          value: '4 members',
          description: 'Active family group members',
          type: 'display',
        },
        {
          label: 'Sharing Permissions',
          value: 'Full access',
          type: 'display',
        },
      ],
      primaryAction: {
        label: 'Manage Family',
        action: () => router.push('/family-group'),
        variant: 'outline',
      },
    },
  ];

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
          Manage your account preferences and security settings
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {settingSections.map((section, index) => (
          <SettingsSection key={index} section={section} />
        ))}
      </div>

      {/* Danger Zone */}
      <DangerZone onDeleteAccount={handleDeleteAccount} />
    </div>
  );
}
