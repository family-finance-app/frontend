import Logo_dark from '@/components/ui/Logo_dark';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useColorTheme } from '@/hooks/useColorTheme';
import Logo_light from '@/components/ui/Logo_light';

export const metadata: Metadata = {
  title: 'Authentication - FamilyFinance',
  description: 'Sign in or create an account for FamilyFinance',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-linear-to-br from-background-50 via-background-200 to-primary-600 dark:from-background-700 dark:via-primary-700 dark:to-stack-700">
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">{children}</div>
      </div>

      <div className="hidden lg:block relative w-0 flex-2">
        <Image
          src="/background.svg"
          alt="Authentication background"
          fill
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />
      </div>
    </div>
  );
}
