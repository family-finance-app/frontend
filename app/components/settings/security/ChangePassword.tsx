'use client';

import { useState, useEffect } from 'react';
import { roboto } from '@/assets/fonts/fonts';
import Button from '@/components/ui/Button_financial';
import { PasswordChangeFormData } from '@/types/security';
import {
  formInputClassname,
  errorInputClassname,
} from '@/assets/globalClassnames';

export interface ChangePasswordProps {
  onSubmit?: (data: PasswordChangeFormData) => Promise<void>;
  isLoading?: boolean;
}

interface FormErrors {
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  general?: string;
}

export function ChangePassword({
  onSubmit,
  isLoading = false,
}: ChangePasswordProps) {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.oldPassword) {
      newErrors.oldPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

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
    <div className="bg-white dark:bg-primary-500 dark:border-primary-500 rounded-2xl shadow-financial border border-background-100 p-6">
      <h2
        className={`${roboto.className} text-lg font-bold text-primary-800 dark:text-stack-800 mb-6`}
      >
        Change Password
      </h2>

      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-background-100 border border-green-200 dark:border-primary-500 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top">
          <div className="shrink-0">
            <svg
              className="h-5 w-5 text-green-700"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-green-800">
              Password changed successfully
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm font-medium text-red-800 dark:text-danger-500">
            {errors.general}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current Password */}
        <div>
          <label
            htmlFor="oldPassword"
            className="block text-sm font-medium text-background-900 dark:text-stack-800 mb-2"
          >
            Current Password
          </label>
          <div className="relative">
            <input
              id="oldPassword"
              type={showPasswords.current ? 'text' : 'password'}
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleInputChange}
              placeholder="Enter your current password"
              className={`${formInputClassname} ${
                errors.oldPassword ? errorInputClassname : ''
              }`}
            />
            <button
              type="button"
              onClick={() =>
                setShowPasswords((prev) => ({
                  ...prev,
                  current: !prev.current,
                }))
              }
              className="absolute right-3 top-2.5 text-background-500 hover:text-background-700"
            >
              {showPasswords.current ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {errors.oldPassword && (
            <p className="text-xs text-danger-600 dark:text-danger-100 mt-1">
              {errors.oldPassword}
            </p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-background-900 mb-2"
          >
            New Password
          </label>
          <div className="relative">
            <input
              id="newPassword"
              type={showPasswords.new ? 'text' : 'password'}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              placeholder="Enter your new password"
              className={`${formInputClassname} ${
                errors.newPassword ? errorInputClassname : ''
              }`}
            />
            <button
              type="button"
              onClick={() =>
                setShowPasswords((prev) => ({
                  ...prev,
                  new: !prev.new,
                }))
              }
              className="absolute right-3 top-2.5 text-background-500 hover:text-background-700"
            >
              {showPasswords.new ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-xs text-danger-600 dark:text-danger-100 mt-1">
              {errors.newPassword}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-background-900 mb-2"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showPasswords.confirm ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your new password"
              className={`${formInputClassname} ${
                errors.confirmPassword ? errorInputClassname : ''
              }`}
            />
            <button
              type="button"
              onClick={() =>
                setShowPasswords((prev) => ({
                  ...prev,
                  confirm: !prev.confirm,
                }))
              }
              className="absolute right-3 top-2.5 text-background-500 hover:text-background-700"
            >
              {showPasswords.confirm ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-danger-600 dark:text-danger-100 mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 pt-4">
          <Button
            text={isLoading ? 'Updating...' : 'Update Password'}
            type="submit"
            variant="primary"
            size="md"
            disabled={isLoading}
          />
        </div>
      </form>
    </div>
  );
}
