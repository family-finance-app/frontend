'use client';

import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Link from 'next/link';
import { AuthResponse, SignUpFormData, FormErrors } from '@/types/auth';
import { validateSignUpForm } from '@/utils/validation';
import { FormInput } from '../shared/forms';

interface SignUpFormProps {
  onSubmit: (formData: SignUpFormData) => Promise<AuthResponse>;
  isLoading?: boolean;
  isSuccess: boolean;
  isError?: boolean;
  errorMessage?: string;
}

export default function SignUpForm({
  onSubmit,
  isLoading,
  isSuccess,
  isError,
  errorMessage,
}: SignUpFormProps) {
  const [formData, setFormData] = useState<SignUpFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({
    email: '',
    password: '',
    confirmPassword: '',
    terms: '',
  });

  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (errorMessage) setApiError(errorMessage);
  }, [errorMessage]);

  const validateForm = (formData: SignUpFormData): boolean => {
    const validationErrors = validateSignUpForm(formData);
    if (validationErrors.email)
      setErrors((prev) => ({ ...prev, email: validationErrors.email }));
    if (validationErrors.password)
      setErrors((prev) => ({ ...prev, password: validationErrors.password }));
    if (validationErrors.confirmPassword)
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validationErrors.confirmPassword,
      }));
    if (validationErrors.terms)
      setErrors((prev) => ({ ...prev, terms: validationErrors.terms }));
    return Object.keys(validationErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: fieldValue }));
    if (errors[name as keyof SignUpFormData])
      setErrors((prev) => ({ ...prev, [name]: '' }));
    if (apiError) {
      setApiError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    if (!validateForm(formData)) return;

    try {
      await onSubmit(formData);
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        terms: false,
      });
      setErrors({});
    } catch (error) {}
  };

  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-medium text-gray-900 dark:text-white">
          Create your account
        </h2>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {isSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
            Account created successfully! Redirecting...
          </div>
        )}

        {isError && apiError?.trim() && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            <div className="flex items-center gap-3">
              <svg
                className="h-5 w-5 text-danger-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-danger-500">
                  Registration failed
                </p>
                <p className="text-sm text-danger-500 mt-1">{apiError}</p>
              </div>
            </div>
          </div>
        )}

        <FormInput
          label={{ type: 'email', text: 'Email address' }}
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="name@example.com"
          required={true}
          error={errors.email}
        />

        <FormInput
          label={{ type: 'password', text: 'Password' }}
          type="password"
          name="password"
          id="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="••••••••"
          required={true}
          error={errors.password}
        />

        <FormInput
          label={{ type: 'confirm-password', text: 'Confirm password' }}
          type="password"
          name="confirmPassword"
          id="confirm-password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          placeholder="••••••••"
          required={true}
          error={errors.confirmPassword}
        />

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              checked={formData.terms}
              onChange={handleInputChange}
              className="w-4 h-4 border-hazel-400 rounded bg-moss-100 focus:ring-3 focus:ring-moss-400"
              required
            />
          </div>
          <div className="ml-3 text-sm">
            <label
              htmlFor="terms"
              className="font-medium text-gray-900 dark:text-white"
            >
              I agree to the{' '}
              <Link
                href="/terms"
                className="text-primary-500 hover:text-primary-600"
              >
                Terms and Conditions
              </Link>
            </label>
            {errors.terms && (
              <p className="mt-1 text-sm text-danger-600">{errors.terms}</p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          text={isLoading ? 'Creating account...' : 'Create account'}
        />
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            href="/sign-in"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </>
  );
}
