'use client';

import { roboto } from '@/assets/fonts/fonts';
import Button from '@/components/ui/Button_financial';

interface TwoFactorAuthProps {
  isEnabled?: boolean;
}

export function TwoFactorAuth({ isEnabled = false }: TwoFactorAuthProps) {
  return (
    <div className="bg-white rounded-2xl shadow-financial border border-background-100 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2
            className={`${roboto.className} text-lg font-bold text-background-900 mb-2`}
          >
            Two-Factor Authentication
          </h2>
          <p className="text-sm text-background-600 mb-4">
            Add an extra layer of security to your account using an
            authenticator app
          </p>

          {isEnabled && (
            <div className="mb-4 p-3 bg-success-50 border border-success-200 rounded-lg">
              <p className="text-sm text-success-700 font-medium">
                ✓ Two-factor authentication is enabled
              </p>
            </div>
          )}

          {!isEnabled && (
            <div className="mb-4 p-3 bg-background-50 border border-background-200 rounded-lg">
              <p className="text-sm text-background-600">
                🔒 This feature is coming soon. Enable 2FA to protect your
                account with an authenticator app like Google Authenticator or
                Authy.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
