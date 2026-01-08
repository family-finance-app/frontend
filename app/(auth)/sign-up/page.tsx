'use client';

import { useRouter } from 'next/navigation';
import { useSignup } from '@/hooks/useSignUp';
import { SignUpFormData, AuthResponse } from '@/types/auth';
import SignUpForm from '@/components/authentication/SignUpForm';
import Link from 'next/link';
import Logo_dark from '@/components/ui/Logo_dark';
import Logo_light from '@/components/ui/Logo_light';
import { useColorTheme } from '@/hooks/useColorTheme';
import { roboto } from '@/assets/fonts/fonts';

export default function SignUp() {
  const router = useRouter();
  const colorTheme = useColorTheme();
  const isDarkMode = colorTheme === 'dark';

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
      <Link href="/">
        <div className="flex items-center justify-center mb-6">
          {isDarkMode ? <Logo_light /> : <Logo_dark />}
        </div>
      </Link>
      <div className="text-center mb-6">
        <h2
          className={`${roboto.variable} text-2xl font-medium text-gray-900 dark:text-background-200`}
        >
          Create your account
        </h2>
      </div>
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
