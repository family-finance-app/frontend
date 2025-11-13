'use client';

import { useState, useEffect } from 'react';
import { roboto } from '@/assets/fonts/fonts';
import Button from '@/components/ui/Button_financial';
import { EmailChangeFormData } from '@/types/security';
import { validateEmail } from '@/utils/validation';

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
    <div className="bg-white rounded-2xl shadow-financial border border-background-100 p-6">
      <h2
        className={`${roboto.className} text-lg font-bold text-background-900 mb-2`}
      >
        Change Email Address
      </h2>
      <p className="text-sm text-background-600 mb-6">
        Current email: <span className="font-semibold">{currentEmail}</span>
      </p>

      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top">
          <div className="shrink-0">
            <svg
              className="h-5 w-5 text-green-600"
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
              Email changed successfully
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm font-medium text-red-800">{errors.general}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* New Email */}
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
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 ${
              errors.newEmail
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-background-200 focus:border-primary-500 focus:ring-primary-500'
            } text-background-900`}
          />
          {errors.newEmail && (
            <p className="text-xs text-red-600 mt-1">{errors.newEmail}</p>
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
