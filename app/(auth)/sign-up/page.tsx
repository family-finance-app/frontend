'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { useSignup, SignUpForm } from '../index';
import { NewUser, SignUpFormData } from '@/(auth)/types';

import { Logo_light, Logo_dark } from '@/components';
import { useColorTheme } from '@/hooks/useColorTheme';

import { roboto } from '@/assets/fonts/fonts';
import { ApiSuccess } from '@/api/types';
import { User } from '@/(main layout)/settings/profile/types';

export default function SignUp() {
  const router = useRouter();
  const colorTheme = useColorTheme();
  const isDarkMode = colorTheme === 'dark';

  const { handleSubmit, isLoading, isError, isSuccess, error, errorMessage } =
    useSignup();

  const handleSignUp = async (
    signUpData: SignUpFormData,
  ): Promise<ApiSuccess<NewUser>> => {
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
