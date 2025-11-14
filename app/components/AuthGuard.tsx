'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useCurrentUser } from '@/api/auth/queries';
import { hasAuthToken, clearAuthToken } from '@/utils/token';

interface AuthGuardProps {
  children: React.ReactNode;
}

const PUBLIC_ROUTES = ['/'];
const AUTH_ROUTES = ['/sign-in', '/sign-up'];

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isClient, setIsClient] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data: user, isLoading, isError } = useCurrentUser();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isPublicRoute =
    PUBLIC_ROUTES.includes(pathname) || pathname.startsWith('/_next');
  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const token = hasAuthToken();

  useEffect(() => {
    if (!isClient) return;

    if (isAuthRoute && token && user && !isError) {
      setIsRedirecting(true);
      setTimeout(() => router.replace('/dashboard'), 100);
      return;
    }

    if (!isPublicRoute && !isAuthRoute && !token) {
      setIsRedirecting(true);
      setTimeout(() => router.replace('/sign-in'), 100);
      return;
    }

    if (
      !isPublicRoute &&
      !isAuthRoute &&
      token &&
      (isError || (!isLoading && !user))
    ) {
      clearAuthToken();
      setIsRedirecting(true);
      setTimeout(() => router.replace('/sign-in'), 100);
      return;
    }

    if (
      isRedirecting &&
      (isPublicRoute || isAuthRoute || (token && user && !isError))
    ) {
      setIsRedirecting(false);
    }
  }, [
    isClient,
    isAuthRoute,
    isPublicRoute,
    token,
    user,
    isError,
    isLoading,
    router,
    pathname,
  ]);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <svg
            className="animate-spin h-8 w-8 text-primary-600"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <div className="text-lg text-gray-600">Redirecting...</div>
        </div>
      </div>
    );
  }

  if (isPublicRoute || isAuthRoute) {
    return <>{children}</>;
  }
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <svg
            className="animate-spin h-8 w-8 text-primary-600"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <div className="text-lg text-gray-600">Authenticating...</div>
        </div>
      </div>
    );
  }

  if (token && user && !isError) {
    return <>{children}</>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg text-gray-600">Loading...</div>
    </div>
  );
}
