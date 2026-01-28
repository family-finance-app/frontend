'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import { FormInput, Button, SuccessMessage, ErrorMessage } from '@/components';

import { SignUpFormData, FormErrors, NewUser } from '@/(auth)/types';

import { validateSignUpForm } from '@/(auth)/utils/validation';
import { ApiSuccess } from '@/api/types';

interface SignUpFormProps {
  onSubmit: (formData: SignUpFormData) => Promise<ApiSuccess<NewUser>>;
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      <form className="space-y-6" onSubmit={handleSubmit}>
        {isSuccess && (
          <SuccessMessage
            message="Account created successfully! Redirecting..."
            classname="dark:bg-background-200 p-4"
          />
        )}

        {isError && errorMessage?.trim() && (
          <ErrorMessage
            message={`Registration failed. ${errorMessage ? errorMessage : ''}`}
            classname="dark:bg-danger-100 bg-danger-100 p-4"
          />
        )}

        <FormInput
          label={{ type: 'email', text: 'Email address' }}
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="email@example.com"
          error={errors.email ? errors.email : ''}
          classname="auth"
        />

        <FormInput
          label={{ type: 'password', text: 'Password' }}
          type="password"
          name="password"
          id="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="••••••••"
          error={errors.password ? errors.password : ''}
          classname="auth"
        />

        <FormInput
          label={{ type: 'confirm-password', text: 'Confirm password' }}
          type="password"
          name="confirmPassword"
          id="confirm-password"
          value={formData.confirmPassword || ''}
          onChange={handleInputChange}
          placeholder="••••••••"
          error={errors.confirmPassword ? errors.confirmPassword : ''}
          classname="auth"
        />

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              checked={formData.terms}
              onChange={handleInputChange}
              className="w-4 h-4 border-hazel-400 rounded focus:ring-moss-400 text-primary-400 accent-moss-400"
              required
            />
          </div>
          <div className="ml-3 text-sm">
            <label
              htmlFor="terms"
              className="font-medium text-gray-900 dark:text-background-100"
            >
              I agree to the{' '}
              <Link
                href="/sign-up" // TODO: write terms and conditions
                className="text-primary-700 hover:text-moss-300"
              >
                Terms and Conditions
              </Link>
            </label>
            {errors.terms && (
              <p className="mt-1 text-sm text-danger-700">{errors.terms}</p>
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
            className="font-medium text-primary-700 hover:text-indigo-500 dark:text-background-100 dark:hover:text-hazel-400"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </>
  );
}
