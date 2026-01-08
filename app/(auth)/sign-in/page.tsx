'use client';

import { useRouter } from 'next/navigation';
import { SignInFormData, AuthResponse } from '@/types/auth';
import { useLogin } from '@/hooks/useSignIn';
import SignInForm from '@/components/authentication/SignInForm';
import Link from 'next/link';
import { useColorTheme } from '@/hooks/useColorTheme';
import Logo_dark from '@/components/ui/Logo_dark';
import Logo_light from '@/components/ui/Logo_light';
import { roboto } from '@/assets/fonts/fonts';

export default function SignIn() {
  const router = useRouter();
  const colorTheme = useColorTheme();
  const isDarkMode = colorTheme === 'dark';
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
        onSubmit={handleSingIn}
        isLoading={isLoading}
        isSuccess={isSuccess}
        isError={isError}
        errorMessage={errorMessage}
      />
    </div>
  );
}
