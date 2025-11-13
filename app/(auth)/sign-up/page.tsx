'use client';

import { useRouter } from 'next/navigation';
import { useSignup } from '@/hooks/useSignUp';
import { SignUpFormData, AuthResponse } from '@/types/auth';
import SignUpForm from '@/components/authentication/SignUpForm';

export default function SignUp() {
  const router = useRouter();

  const { handleSubmit, isLoading, isError, isSuccess, error, errorMessage } =
    useSignup();

  const handleSignUp = async (
    signUpData: Partial<SignUpFormData>
  ): Promise<AuthResponse> => {
    const result = await handleSubmit({
      email: signUpData.email,
      password: signUpData.password,
      terms: signUpData.terms,
    });
    if (result) router.push('/dashboard');
    return result;
  };

  return (
    <div className="w-full">
      <SignUpForm
        onSubmit={handleSignUp}
        isLoading={isLoading}
        isSuccess={isSuccess}
        isError={isError}
        errorMessage={errorMessage}
      />
    </div>
  );
}
