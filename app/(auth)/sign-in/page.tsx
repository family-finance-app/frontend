'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SignInFormData, FormErrors } from '@/types/auth';
import { useSignIn } from '@/api/auth/mutations';
import { validateSignInForm } from '@/utils/validation';

export default function SignIn() {
  const router = useRouter();
  const signInMutation = useSignIn();

  const [formData, setFormData] = useState<SignInFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateSignInForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      await signInMutation.mutateAsync(formData);
      router.push('/dashboard');
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'error' in error) {
        const apiError = error as {
          error: string;
          details?: Array<{ path: string[]; message: string }>;
          message?: string;
        };

        if (apiError.error === 'Validation failed' && apiError.details) {
          const backendErrors: FormErrors = {};
          apiError.details.forEach((err) => {
            backendErrors[err.path[0]] = err.message;
          });
          setErrors(backendErrors);
        } else {
          setErrors({
            general:
              apiError.message ||
              'Sign in failed. Please check your credentials.',
          });
        }
      } else {
        setErrors({ general: 'An unexpected error occurred' });
      }
    }
  };
  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-medium text-gray-900 dark:text-white">
          Welcome back
        </h2>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {signInMutation.isSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
            Signed in successfully! Redirecting...
          </div>
        )}

        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            User not found
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
            onChange={handleChange}
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
            onChange={handleChange}
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
              onChange={handleChange}
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

        <button
          type="submit"
          disabled={signInMutation.isPending}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {signInMutation.isPending ? 'Signing in...' : 'Sign in'}
        </button>
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
    </div>
  );
}
