'use client';

import { useRouter } from 'next/navigation';
import { SignInFormData, AuthResponse } from '@/types/auth';
import { useLogin } from '@/hooks/useSignIn';
import SignInForm from '@/components/authentication/SignInForm';

export default function SignIn() {
  const router = useRouter();
  const { handleSubmit, isLoading, isError, isSuccess, error, errorMessage } =
    useLogin();

  const handleSingIn = async (
    signInData: SignInFormData
  ): Promise<AuthResponse> => {
    const result = await handleSubmit(signInData);
    if (result) {
      router.push('/dashboard');
    }
    return result;
  };

  return (
    <div className="w-full">
      <SignInForm
        onSubmit={handleSingIn}
        isLoading={isLoading}
        isSuccess={isSuccess}
        isError={isError}
        errorMessage={errorMessage}
      />
    </div>
  );
}
