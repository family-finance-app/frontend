'use client';

import { useState, useEffect } from 'react';

import { RiEyeLine, RiEyeOffLine } from '@remixicon/react';

import { roboto } from '@/assets/fonts/fonts';

import { ChangePasswordFormData, ChangePasswordFormErrors } from '../types';

import { validateChangePasswordForm } from '../utils/validation';

import {
  Button,
  ErrorMessage,
  SuccessMessage,
  FormInput,
  FormActions,
} from '@/components';

interface ChangePasswordFormProps {
  onSubmit?: (data: ChangePasswordFormData) => Promise<void>;
  isLoading?: boolean;
}

export default function ChangePasswordForm({
  onSubmit,
  isLoading = false,
}: ChangePasswordFormProps) {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<ChangePasswordFormErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof ChangePasswordFormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateChangePasswordForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await onSubmit?.({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });
      setFormData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setErrors({});
      setShowSuccess(true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to change password';
      setErrors({ general: message });
    }
  };

  return (
    <div className="bg-white dark:bg-background-100 border-l-2 dark:border-l-primary-700 rounded-2xl shadow-financial p-6">
      <h2
        className={`${roboto.className} text-lg font-bold text-primary-800 dark:text-stack-800 mb-6`}
      >
        Change Password
      </h2>

      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-background-100 border border-green-200 dark:border-primary-500 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top">
          <SuccessMessage message="Password changed successfully" />
        </div>
      )}

      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <ErrorMessage message={errors.general} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <FormInput
            label={{ type: 'oldPassword', text: 'Current Password' }}
            id="oldPassword"
            type={showPasswords.current ? 'text' : 'password'}
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleInputChange}
            placeholder="Enter your current password"
            classname="internal"
            error={errors.oldPassword}
          />
          <button
            type="button"
            onClick={() =>
              setShowPasswords((prev) => ({
                ...prev,
                current: !prev.current,
              }))
            }
            className="absolute right-3 top-8 text-background-500 hover:text-background-700"
          >
            {showPasswords.current ? <RiEyeOffLine /> : <RiEyeLine />}
          </button>
        </div>

        <div className="relative">
          <FormInput
            label={{ type: 'newPassword', text: 'New Password' }}
            id="newPassword"
            type={showPasswords.new ? 'text' : 'password'}
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            placeholder="Enter your new password"
            classname="internal"
            error={errors.newPassword}
          />
          <button
            type="button"
            onClick={() =>
              setShowPasswords((prev) => ({
                ...prev,
                new: !prev.new,
              }))
            }
            className="absolute right-3 top-8 text-background-500 hover:text-background-700"
          >
            {showPasswords.new ? <RiEyeOffLine /> : <RiEyeLine />}
          </button>
        </div>

        <div className="relative">
          <FormInput
            label={{ type: 'confirmPassword', text: 'Confirm Password' }}
            id="confirmPassword"
            type={showPasswords.confirm ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm your new password"
            classname="internal"
            error={errors.confirmPassword}
          />
          <button
            type="button"
            onClick={() =>
              setShowPasswords((prev) => ({
                ...prev,
                confirm: !prev.confirm,
              }))
            }
            className="absolute right-3 top-8 text-background-500 hover:text-background-700"
          >
            {showPasswords.confirm ? <RiEyeOffLine /> : <RiEyeLine />}
          </button>
        </div>

        <FormActions isLoading={isLoading} submitLabel="Update Password" />
      </form>
    </div>
  );
}
