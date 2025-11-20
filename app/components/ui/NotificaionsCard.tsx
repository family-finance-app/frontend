'use client';

import { useState } from 'react';

export interface NotificationSettings {
  emailNotifications: boolean;
  transactionAlerts: boolean;
  monthlyReports: boolean;
  budgetAlerts?: boolean;
  weeklyDigest?: boolean;
}

interface NotificationsCardProps {
  initialSettings: NotificationSettings;
  onSave: (settings: NotificationSettings) => Promise<void>;
  onChange?: (settings: NotificationSettings) => void;
  showSaveButton?: boolean;
  isLoading?: boolean;
}

export default function NotificationsCard({
  initialSettings,
  onSave,
  onChange,
  showSaveButton = true,
  isLoading = false,
}: NotificationsCardProps) {
  const [settings, setSettings] =
    useState<NotificationSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const hasChanges =
    JSON.stringify(settings) !== JSON.stringify(initialSettings);

  const handleToggle = (key: keyof NotificationSettings) => {
    const newSettings = {
      ...settings,
      [key]: !settings[key],
    };
    setSettings(newSettings);
    onChange?.(newSettings);
    setSaveMessage(null);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveMessage(null);
      await onSave(settings);
      setSaveMessage({
        type: 'success',
        text: 'Notification settings saved successfully!',
      });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage({
        type: 'error',
        text:
          error instanceof Error ? error.message : 'Failed to save settings',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(initialSettings);
    onChange?.(initialSettings);
    setSaveMessage(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🔔</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Notification Settings
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                Manage how you receive updates
              </p>
            </div>
          </div>
          {hasChanges && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
              Unsaved changes
            </span>
          )}
        </div>
      </div>

      <div className="p-6">
        {saveMessage && (
          <div
            className={`mb-4 p-3 rounded-md ${
              saveMessage.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 text-green-800 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-800 dark:text-red-400'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {saveMessage.type === 'success' ? '✅' : '❌'}
              </span>
              <span className="text-sm font-medium">{saveMessage.text}</span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <div className="flex-1">
              <label
                htmlFor="emailNotifications"
                className="font-medium text-gray-900 dark:text-white cursor-pointer block"
              >
                Email Notifications
              </label>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Receive important updates via email
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4">
              <input
                id="emailNotifications"
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={() => handleToggle('emailNotifications')}
                disabled={isLoading || isSaving}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <div className="flex-1">
              <label
                htmlFor="transactionAlerts"
                className="font-medium text-gray-900 dark:text-white cursor-pointer block"
              >
                Transaction Alerts
              </label>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Get notified for every transaction
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4">
              <input
                id="transactionAlerts"
                type="checkbox"
                checked={settings.transactionAlerts}
                onChange={() => handleToggle('transactionAlerts')}
                disabled={isLoading || isSaving}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <div className="flex-1">
              <label
                htmlFor="monthlyReports"
                className="font-medium text-gray-900 dark:text-white cursor-pointer block"
              >
                Monthly Reports
              </label>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Receive monthly financial summaries
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4">
              <input
                id="monthlyReports"
                type="checkbox"
                checked={settings.monthlyReports}
                onChange={() => handleToggle('monthlyReports')}
                disabled={isLoading || isSaving}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {settings.budgetAlerts !== undefined && (
            <div className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex-1">
                <label
                  htmlFor="budgetAlerts"
                  className="font-medium text-gray-900 dark:text-white cursor-pointer block"
                >
                  Budget Alerts
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Get notified when approaching budget limits
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  id="budgetAlerts"
                  type="checkbox"
                  checked={settings.budgetAlerts}
                  onChange={() => handleToggle('budgetAlerts')}
                  disabled={isLoading || isSaving}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          )}

          {settings.weeklyDigest !== undefined && (
            <div className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex-1">
                <label
                  htmlFor="weeklyDigest"
                  className="font-medium text-gray-900 dark:text-white cursor-pointer block"
                >
                  Weekly Digest
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Receive weekly activity summaries
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  id="weeklyDigest"
                  type="checkbox"
                  checked={settings.weeklyDigest}
                  onChange={() => handleToggle('weeklyDigest')}
                  disabled={isLoading || isSaving}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          )}
        </div>

        {showSaveButton && (
          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleReset}
              disabled={!hasChanges || isLoading || isSaving}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!hasChanges || isLoading || isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isSaving && (
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
