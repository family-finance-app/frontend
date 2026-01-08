'use client';

import { useState, useEffect } from 'react';
import { roboto } from '@/assets/fonts/fonts';
import Button from '@/components/ui/Button_financial';
import { EmailChangeFormData } from '@/types/security';
import { validateEmail } from '@/utils/validation';
import SuccessMessage from '@/components/ui/SuccessMessage';
import ErrorMessage from '@/components/ui/ErrorMessage';
import {
  errorInputClassname,
  formInputClassname,
} from '@/assets/globalClassnames';

interface ChangeEmailProps {
  currentEmail: string;
  onSubmit?: (data: EmailChangeFormData) => Promise<void>;
  isLoading?: boolean;
}

interface FormErrors {
  newEmail?: string;
  general?: string;
}

export function ChangeEmail({
  currentEmail,
  onSubmit,
  isLoading = false,
}: ChangeEmailProps) {
  const [formData, setFormData] = useState<EmailChangeFormData>({
    newEmail: currentEmail,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const validateForm = (): boolean => {
    const newErrors: Partial<EmailChangeFormData> = {};

    validateEmail(formData.newEmail);

    if (formData.newEmail === currentEmail) {
      newErrors.newEmail = 'New email must be different from current email';
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
    if (errors[name as keyof EmailChangeFormData]) {
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
      await onSubmit?.(formData);
      setFormData({ newEmail: currentEmail });
      setErrors({});
      setShowSuccess(true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to change email';
      setErrors({ general: message });
    }
  };

  return (
    <div className="bg-white dark:bg-primary-500 dark:border-primary-500 rounded-2xl shadow-financial border border-background-100 p-6">
      <h2
        className={`${roboto.className} text-lg font-bold text-primary-800 dark:text-stack-800 mb-2`}
      >
        Change Email Address
      </h2>
      <p className="text-sm text-background-600 dark:text-stack-800 mb-6">
        Current email: <span className="font-semibold">{currentEmail}</span>
      </p>

      {showSuccess && <SuccessMessage message="Email changed successfully" />}
      {errors.general && <ErrorMessage message={errors.general} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="newEmail"
            className="block text-sm font-medium text-background-900 mb-2"
          >
            New Email Address
          </label>
          <input
            id="newEmail"
            type="email"
            name="newEmail"
            value={formData.newEmail}
            onChange={handleInputChange}
            placeholder="Enter your new email"
            className={`${formInputClassname} ${
              errors.newEmail ? errorInputClassname : ''
            }`}
          />
          {errors.newEmail && (
            <p className="text-xs text-danger-600 dark:text-danger-100 mt-1">
              {errors.newEmail}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 pt-4">
          <Button
            text={isLoading || isLoading ? 'Updating...' : 'Change Email'}
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
