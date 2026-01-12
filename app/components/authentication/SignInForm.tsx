'use client';

import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Link from 'next/link';
import { AuthResponse, SignInFormData, FormErrors } from '@/types/auth';
import { validateSignInForm } from '@/utils/validation';
import { RiCheckFill } from '@remixicon/react';
import SuccessMessage from '../ui/SuccessMessage';
import ErrorMessage from '../ui/ErrorMessage';
import { FormInput } from '../shared';

interface SignInFormProps {
  onSubmit: (formData: SignInFormData) => Promise<AuthResponse>;
  isLoading?: boolean;
  isSuccess: boolean;
  isError?: boolean;
  errorMessage?: string;
}

export default function SignInForm({
  onSubmit,
  isLoading,
  isSuccess,
  isError,
  errorMessage,
}: SignInFormProps) {
  const [formData, setFormData] = useState<SignInFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState<FormErrors>({ email: '', password: '' });

  const validateForm = (formData: SignInFormData): boolean => {
    const validationErrors = validateSignInForm(formData);
    if (validationErrors.email)
      setErrors((prev) => ({ ...prev, email: validationErrors.email }));
    if (validationErrors.password)
      setErrors((prev) => ({ ...prev, password: validationErrors.password }));
    return Object.keys(validationErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof SignInFormData])
      setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm(formData)) return;

    try {
      await onSubmit(formData);
      setFormData({ email: '', password: '', rememberMe: false });
      setErrors({});
    } catch (error) {}
  };

  return (
    <>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {isSuccess && (
          <SuccessMessage
            message="Login successful! Redirecting..."
            classname="bg-primary-200 dark:bg-background-200 p-4"
          />
        )}

        {isError && errorMessage && (
          <ErrorMessage
            message={`Login failed. ${errorMessage}`}
            classname="bg-danger-100 border-0 dark:bg-danger-100 p-4"
          />
        )}

        <FormInput
          label={{ type: 'email', text: 'Email address' }}
          name="email"
          type="email"
          id="email"
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email ? errors.email : ''}
          placeholder="email@example.com"
          classname="auth"
        />

        <FormInput
          label={{ type: 'password', text: 'Password' }}
          name="password"
          type="password"
          id="password"
          value={formData.password}
          onChange={handleInputChange}
          error={errors.password ? errors.password : ''}
          placeholder="••••••••"
          classname="auth"
        />

        {/* <div className="flex items-center justify-between">
          <div className="text-sm">
            <Link
              href="/sign-in"
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-background-100 dark:hover:text-hazel-400"
            >
              Forgot your password?
            </Link>
          </div>
        </div> */}

        <Button
          type="submit"
          disabled={isLoading}
          text={isLoading ? 'Signing in...' : 'Sign in'}
          variant="primary"
        />
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Do not have an account?{' '}
          <Link
            href="/sign-up"
            className="font-medium text-primary-700 hover:text-primary-600 dark:text-background-100 dark:hover:text-hazel-400"
          >
            Create a new account here
          </Link>
        </p>
      </div>
    </>
  );
}
