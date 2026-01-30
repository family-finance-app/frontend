'use client';

import { useState } from 'react';

import {
  ChangeProfileFormErrors,
  User,
  type ChangeProfileFormData,
} from '../types';

import {
  SuccessMessage,
  FormActions,
  FormInput,
  ErrorMessage,
} from '@/components';

import { roboto } from '@/assets/fonts/fonts';
import { validateChangeProfileForm } from '../utils';

interface ProfileEditFormProps {
  user: User;
  onSubmit?: (data: ChangeProfileFormData) => Promise<void>;
  isLoading?: boolean;
}

export default function ProfileEditForm({
  user,
  onSubmit,
  isLoading = false,
}: ProfileEditFormProps) {
  const [formData, setFormData] = useState<ChangeProfileFormData>({
    name: user?.name || '',
    birthdate: user.birthdate || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<ChangeProfileFormErrors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateChangeProfileForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (onSubmit && !isSubmitting) {
      setIsSubmitting(true);
      try {
        const data: ChangeProfileFormData = {
          ...formData,
          birthdate: formData.birthdate
            ? new Date(formData.birthdate).toISOString()
            : undefined,
        };
        await onSubmit(data);
        setErrors({});
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } catch (error: any) {
        setErrors({ general: error.message });
        setTimeout(() => setErrors({}), 3000);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="bg-background-50 dark:bg-background-100 border-l-2 dark:border-l-primary-700 rounded-2xl shadow-financial p-6">
      <h2
        className={`${roboto.className} text-lg font-bold text-primary-800 dark:text-stack-800 mb-6`}
      >
        Personal Information
      </h2>

      {showSuccess && <SuccessMessage message="Profile updated successfully" />}
      {errors.general && <ErrorMessage message={errors.general} />}
      {errors.name && <ErrorMessage message={errors.name} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label={{ type: 'name', text: 'Full Name' }}
          name="name"
          type="text"
          id="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder={user.name}
          classname="internal"
        />

        <FormInput
          label={{
            type: 'dateOfBirth',
            text: user.birthdate
              ? new Date(user.birthdate || '').toLocaleDateString('ua-UA')
              : 'Enter your birthdate',
          }}
          name="birthdate"
          type="date"
          id="birthdate"
          value={formData.birthdate ?? ''}
          onChange={handleInputChange}
          classname="internal"
        />

        <div className="flex gap-3 pt-4">
          <FormActions
            onCancel={() => {
              setFormData({
                name: '',
                birthdate: '',
              });
            }}
          />
        </div>
      </form>
    </div>
  );
}
