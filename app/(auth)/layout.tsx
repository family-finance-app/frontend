import type { Metadata } from 'next';
import Image from 'next/image';

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
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <a href="/">
            <div className="flex items-center justify-center mb-8">
              <Image
                src="/icons/logo-icon.svg"
                alt="FamilyFinance Logo"
                width={24}
                height={24}
                className="mr-3"
              />
              <span className="text-2xl text-gray-900 dark:text-white">
                FamilyFinance
              </span>
            </div>
          </a>

          {children}
        </div>
      </div>

      <div className="hidden lg:block relative w-0 flex-1">
        <Image
          src="/auth-bg.svg"
          alt="Authentication background"
          fill
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
