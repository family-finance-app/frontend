'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types/profile';
import { roboto, jetbrainsMono } from '@/assets/fonts/fonts';
import Button from '@/components/ui/Button_financial';

export interface ProfileFormData extends Partial<User> {
  name: string;
  birthdate: string;
}

interface ProfileEditFormProps {
  user: User;
  onSubmit?: (data: ProfileFormData) => Promise<void>;
  isLoading?: boolean;
}

export function ProfileEditForm({
  user,
  onSubmit,
  isLoading = false,
}: ProfileEditFormProps) {
  const [formData, setFormData] = useState<ProfileFormData>({
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
        const data: ProfileFormData = {
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
    <div className="bg-white rounded-2xl shadow-financial border border-background-100 p-6">
      <h2
        className={`${roboto.className} text-lg font-bold text-background-900 mb-6`}
      >
        Personal Information
      </h2>

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
              Profile updated successfully
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-background-900 mb-2"
          >
            Full Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder={user.name}
            className="w-full px-4 py-2 border border-background-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-background-900"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label
            htmlFor="dateOfBirth"
            className="block text-sm font-medium text-background-900 mb-2"
          >
            Date of Birth
          </label>
          <input
            id="birthdate"
            type="date"
            name="birthdate"
            value={formData.birthdate}
            onChange={handleInputChange}
            placeholder={user.birthdate}
            className="w-full px-4 py-2 border border-background-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-background-900"
          />
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 pt-4">
          <Button
            text={isSubmitting || isLoading ? 'Saving...' : 'Save Changes'}
            type="submit"
            variant="primary"
            size="md"
            disabled={isSubmitting || isLoading}
          />
          <Button
            text="Cancel"
            type="button"
            variant="outline"
            size="md"
            onClick={() => {
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
