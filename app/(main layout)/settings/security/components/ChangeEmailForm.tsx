'use client';

import { useState, useEffect } from 'react';

import { roboto } from '@/assets/fonts/fonts';

import {
  Button,
  ErrorMessage,
  SuccessMessage,
  FormInput,
  FormActions,
} from '@/components';

import { ChangeEmailFormData, ChangeEmailFormErrors } from '../types';

import { validateChangeEmailForm } from '../utils/validation';

interface ChangeEmailProps {
  currentEmail: string;
  onSubmit?: (data: ChangeEmailFormData) => Promise<void>;
  isLoading?: boolean;
}

export default function ChangeEmail({
  currentEmail,
  onSubmit,
  isLoading = false,
}: ChangeEmailProps) {
  const [formData, setFormData] = useState<ChangeEmailFormData>({
    newEmail: '',
  });
  const [errors, setErrors] = useState<ChangeEmailFormErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);

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
    if (errors[name as keyof ChangeEmailFormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateChangeEmailForm(formData, currentEmail);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

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
    <div className="bg-white dark:bg-background-100 border-l-2 dark:border-l-primary-700 rounded-2xl shadow-financial p-6">
      <h2
        className={`${roboto.className} text-lg font-bold text-primary-800 dark:text-stack-800 mb-2`}
      >
        Change Email
      </h2>
      <p className="text-sm text-background-600 dark:text-stack-800 mb-6">
        Current email: <span className="font-semibold">{currentEmail}</span>
      </p>

      {showSuccess && <SuccessMessage message="Email changed successfully" />}
      {errors.general && <ErrorMessage message={errors.general} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <FormInput
            label={{ type: 'newEmail', text: 'New Email' }}
            id="newEmail"
            type="email"
            name="newEmail"
            value={formData.newEmail}
            onChange={handleInputChange}
            placeholder="Enter your new email"
            classname="internal"
            error={errors.newEmail}
          />
        </div>

        <FormActions
          submitLabel={isLoading || isLoading ? 'Updating...' : 'Change Email'}
          isLoading={isLoading}
        />
      </form>
    </div>
  );
}
