'use client';

import { roboto } from '@/assets/fonts/fonts';
import Button from '@/components/ui/Button';
import { useCurrentUser } from '@/api/auth/queries';
import { useUpdatePassword } from '@/(main layout)/settings/hooks/useUpdatePassword';
import { useUpdateEmail } from '@/(main layout)/settings/hooks/useUpdateEmail';
import {
  ChangePassword,
  ChangeEmail,
  TwoFactorAuth,
} from '@/(main layout)/settings/security';
import { ChangePasswordFormData, ChangeEmailFormData } from './types';

export default function SecuritySettings() {
  const { user, isLoading: userLoading } = useCurrentUser();
  const { handleSubmit, isLoading: isUpdating } = useUpdatePassword();
  const { handleSubmitEmail, isLoading: isLoading } = useUpdateEmail();

  const handlePasswordChange = async (formData: ChangePasswordFormData) => {
    await handleSubmit(formData);
  };

  const handleEmailChange = async (formData: ChangeEmailFormData) => {
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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1
            className={`${roboto.className} text-3xl font-bold text-primary-800 mb-2`}
          >
            Security Settings
          </h1>
          <p className="text-primary-800">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChangePassword
          onSubmit={handlePasswordChange}
          isLoading={isUpdating}
        />

        <ChangeEmail
          currentEmail={user.email}
          onSubmit={handleEmailChange}
          isLoading={isLoading}
        />
      </div>

      <div>
        <TwoFactorAuth isEnabled={false} />
      </div>
    </div>
  );
}
