'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SignInFormData, FormErrors, AuthResponse } from '@/types/auth';
import { useLogin } from '@/hooks/useSignIn';
import { validateSignInForm } from '@/utils/validation';
import SignInForm from '@/components/authentication/SIgnInForm';

export default function SignIn() {
  const router = useRouter();
  const {
    handleSubmit,
    isLoading: isLoading,
    isError: isError,
    isSuccess: isSuccess,
    error: error,
    errorReason: errorReason,
  } = useLogin();

  const handleSingIn = async (
    signInData: SignInFormData
  ): Promise<AuthResponse> => {
    return await handleSubmit(signInData);
  };

  return (
    <div className="w-full">
      <SignInForm
        onSubmit={handleSingIn}
        isLoading={isLoading}
        isSuccess={isSuccess}
        isError={isError}
      />
    </div>
  );
}
