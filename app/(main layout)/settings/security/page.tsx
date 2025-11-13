'use client';

import { useState } from 'react';
import { roboto } from '@/assets/fonts/fonts';
import Button from '@/components/ui/Button_financial';
import { useCurrentUser } from '@/api/auth/queries';
import { useUpdatePassword } from '@/hooks/useUpdatePassword';
import { useUpdateEmail } from '@/hooks/useUpdateEmail';
import {
  ChangePassword,
  ChangeEmail,
  TwoFactorAuth,
} from '@/components/settings/security';
import { PasswordChangeFormData, EmailChangeFormData } from '@/types/security';

export default function SecuritySettings() {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { handleSubmit, isLoading: isUpdating } = useUpdatePassword();
  const { handleSubmitEmail, isLoading: isLoading } = useUpdateEmail();

  const handlePasswordChange = async (formData: PasswordChangeFormData) => {
    await handleSubmit(formData);
  };

  const handleEmailChange = async (formData: EmailChangeFormData) => {
    await handleSubmitEmail(formData);
  };

  if (userLoading || !user) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-background-500">Loading security settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1
            className={`${roboto.className} text-3xl font-bold text-background-900 mb-2`}
          >
            Security Settings
          </h1>
          <p className="text-background-600">
            Manage your account security and authentication methods
          </p>
        </div>

        <div className="mt-4 lg:mt-0">
          <Button
            text="← Back to Settings"
            type="button"
            variant="outline"
            size="md"
            onClick={() => (window.location.href = '/settings')}
          />
        </div>
      </div>

      {/* Security Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Change Password */}
        <ChangePassword
          onSubmit={handlePasswordChange}
          isLoading={isUpdating}
        />

        {/* Change Email */}
        <ChangeEmail
          currentEmail={user.email}
          onSubmit={handleEmailChange}
          isLoading={isLoading}
        />
      </div>

      {/* Two-Factor Authentication */}
      <div>
        <TwoFactorAuth isEnabled={false} />
      </div>
    </div>
  );
}
