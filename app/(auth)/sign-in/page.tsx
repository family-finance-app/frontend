'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Login, SignInFormData } from '@/(auth)/types';
import { useLogin, SignInForm } from '../index';

import { useColorTheme } from '@/hooks/useColorTheme';

import { Logo_light, Logo_dark } from '@/components';

import { roboto } from '@/assets/fonts/fonts';
import { ApiSuccess } from '@/api/types';

export default function SignIn() {
  const router = useRouter();
  const colorTheme = useColorTheme();
  const isDarkMode = colorTheme === 'dark';
  const { handleSubmit, isLoading, isError, isSuccess, error, errorMessage } =
    useLogin();

  const handleSignIn = async (
    signInData: SignInFormData,
  ): Promise<ApiSuccess<Login>> => {
    const result = await handleSubmit(signInData);
    if (result) {
      router.push('/dashboard');
    }
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
          className={`${roboto.variable} text-2xl font-medium text-background-600 dark:text-background-200`}
        >
          Welcome back
        </h2>
      </div>
      <SignInForm
        onSubmit={handleSignIn}
        isLoading={isLoading}
        isSuccess={isSuccess}
        isError={isError}
        errorMessage={errorMessage}
      />
    </div>
  );
}
