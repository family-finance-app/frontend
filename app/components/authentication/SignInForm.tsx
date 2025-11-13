'use client';

import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Link from 'next/link';
import { AuthResponse, SignInFormData, FormErrors } from '@/types/auth';
import { validateSignInForm } from '@/utils/validation';

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
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (errorMessage) {
      setApiError(errorMessage);
    }
  }, [errorMessage]);

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
      setFormData({ email: '', password: '', rememberMe: false });
      setErrors({});
    } catch (error) {}
  };

  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-medium text-gray-900 dark:text-white">
          Welcome back
        </h2>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {isSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex items-center gap-3">
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
              <p className="text-sm font-medium text-green-800">
                Signed in successfully! Redirecting...
              </p>
            </div>
          </div>
        )}

        {isError && apiError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
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
                  Sign in failed
                </p>
                <p className="text-sm text-danger-500 mt-1">{apiError}</p>
              </div>
            </div>
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Email address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleInputChange}
            className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="name@example.com"
            required
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="••••••••"
            className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            required
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="remember"
              className="ml-2 block text-sm text-gray-900"
            >
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <Link
              href="/forgot-password"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          text={isLoading ? 'Signing in...' : 'Sign in'}
        />
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Do not have an account?{' '}
          <Link
            href="/sign-up"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Create a new account here
          </Link>
        </p>
      </div>
    </>
  );
}
