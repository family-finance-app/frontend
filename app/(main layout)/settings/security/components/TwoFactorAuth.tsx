'use client';

import { roboto } from '@/assets/fonts/fonts';

interface TwoFactorAuthProps {
  isEnabled?: boolean;
}

export default function TwoFactorAuth({
  isEnabled = false,
}: TwoFactorAuthProps) {
  return (
    <div className="bg-background-50 dark:bg-background-300 border-l-2 dark:border-l-primary-700 rounded-2xl shadow-financial p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2
            className={`${roboto.className} text-lg font-bold text-primary-800 mb-2`}
          >
            Two-Factor Authentication
          </h2>
          <p className="text-sm text-background-700 mb-4">
            Add an extra layer of security to your account using an
            authenticator app
          </p>

          {isEnabled && (
            <div className="mb-4 p-3 bg-success-50 border border-success-200 rounded-lg">
              <p className="text-sm text-success-700 font-medium">
                Two-factor authentication is enabled
              </p>
            </div>
          )}

          {!isEnabled && (
            <div className="mb-4 p-3 bg-background-50 dark:bg-background-100 border border-background-200 rounded-lg">
              <p className="text-sm text-background-600">
                This feature is coming soon. Enable 2FA to protect your account
                with an authenticator app like Google Authenticator.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
