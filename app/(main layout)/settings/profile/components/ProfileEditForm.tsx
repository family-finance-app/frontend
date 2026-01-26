'use client';

import { useState } from 'react';

import { User, type ChangeProfileFormData } from '../types';

import { SuccessMessage, FormActions, FormInput } from '@/components';

import { roboto } from '@/assets/fonts/fonts';

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
    birthdate: user?.birthdate || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit && !isSubmitting) {
      setIsSubmitting(true);
      try {
        const data: ChangeProfileFormData = {
          ...formData,
          birthdate: formData.birthdate
            ? new Date(formData.birthdate).toISOString()
            : formData.birthdate,
        };
        await onSubmit(data);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
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

      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50  dark:bg-background-100 border border-green-200 dark:border-primary-500 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top">
          <SuccessMessage message="Profile updated successfully" />
        </div>
      )}

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
          label={{ type: 'dateOfBirth', text: 'Date of Birth' }}
          name="birthdate"
          type="date"
          id="birthdate"
          value={formData.birthdate}
          onChange={handleInputChange}
          placeholder={user.birthdate}
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
