/**
 * Settings utilities for data transformation and configuration
 */

export interface SettingItem {
  label: string;
  value: string;
  description?: string;
  action?: () => void;
  actionLabel?: string;
  type: 'display' | 'action' | 'toggle' | 'select';
  options?: string[];
  enabled?: boolean;
}

export interface SettingSection {
  title: string;
  description: string;
  icon: string;
  items: SettingItem[];
  primaryAction?: {
    label: string;
    action: () => void;
    variant?: 'primary' | 'outline' | 'danger';
  };
}

/**
 * Notification settings state type
 */
export interface NotificationSettings {
  emailNotifications: boolean;
  transactionAlerts: boolean;
  monthlyReports: boolean;
  budgetAlerts: boolean;
  weeklyDigest: boolean;
}

/**
 * Get initial notification settings
 */
export const getInitialNotificationSettings = (): NotificationSettings => ({
  emailNotifications: true,
  transactionAlerts: true,
  monthlyReports: false,
  budgetAlerts: true,
  weeklyDigest: false,
});

/**
 * Get display text for notification toggle
 */
export const getNotificationStatusText = (enabled: boolean): string =>
  enabled ? 'Enabled' : 'Disabled';

/**
 * Language options
 */
export const LANGUAGE_OPTIONS = ['English', 'Українська'] as const;

/**
 * Currency options
 */
export const CURRENCY_OPTIONS = ['USD ($)', 'EUR (€)', 'UAH (₴)'] as const;

/**
 * Date format options
 */
export const DATE_FORMAT_OPTIONS = [
  'MM/DD/YYYY',
  'DD/MM/YYYY',
  'YYYY-MM-DD',
] as const;

/**
 * Theme options
 */
export const THEME_OPTIONS = ['Light', 'Dark', 'System'] as const;
