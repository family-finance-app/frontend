'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useCurrentUser } from '@/api/auth/queries';
import { hasAuthToken, getAuthToken } from '@/utils/token';

interface AuthGuardProps {
  children: React.ReactNode;
}

const PUBLIC_ROUTES = ['/'];
const AUTH_ROUTES = ['/sign-in', '/sign-up'];

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isClient, setIsClient] = useState(false);
  const [tokenChanged, setTokenChanged] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  const token = hasAuthToken();
  const { data: user, isLoading, isError } = useCurrentUser();

  useEffect(() => {
    setIsClient(true);
    const handleStorageChange = () => {
      setTokenChanged((prev) => prev + 1);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
    const isAuthRoute = AUTH_ROUTES.includes(pathname);
    const isProtectedRoute = !isPublicRoute && !isAuthRoute;

    if (isAuthRoute) {
      if (token && user && !isLoading && !isError) {
        router.replace('/dashboard');
      }
      return;
    }

    if (isProtectedRoute) {
      if (!token) {
        router.replace('/sign-in');
        return;
      }
      if (!isLoading && (isError || !user)) {
        router.replace('/sign-in');
        return;
      }
    }
  }, [
    isClient,
    pathname,
    token,
    user,
    isLoading,
    isError,
    router,
    tokenChanged,
  ]);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const isProtectedRoute = !isPublicRoute && !isAuthRoute;

  if (isPublicRoute || isAuthRoute) {
    return <>{children}</>;
  }

  if (token && isLoading) {
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
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (token && user && !isError) {
    return <>{children}</>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg text-gray-600">Checking access...</div>
    </div>
  );
}
