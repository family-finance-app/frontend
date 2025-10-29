// Settings utility types and constants

export interface NotificationSettings {
  emailNotifications: boolean;
  transactionAlerts: boolean;
  monthlyReports: boolean;
  budgetAlerts: boolean;
  weeklyDigest?: boolean;
}

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

// Helper functions
export const getInitialNotificationSettings = (): NotificationSettings => ({
  emailNotifications: true,
  transactionAlerts: true,
  monthlyReports: false,
  budgetAlerts: true,
  weeklyDigest: false,
});

export const getNotificationStatusText = (enabled: boolean): string =>
  enabled ? 'Enabled' : 'Disabled';

// Options arrays
export const LANGUAGE_OPTIONS = ['English', 'Українська'];
export const CURRENCY_OPTIONS = ['USD ($)', 'EUR (€)', 'UAH (₴)'];
export const DATE_FORMAT_OPTIONS = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'];
export const THEME_OPTIONS = ['Light', 'Dark', 'System'];
