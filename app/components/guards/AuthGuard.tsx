'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { useCurrentUser } from '@/api/auth/queries';

import { hasAuthToken } from '@/utils';

interface AuthGuardProps {
  children: React.ReactNode;
}

const PUBLIC_ROUTES = ['/'];
const AUTH_ROUTES = ['/sign-in', '/sign-up'];

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [tokenChanged, setTokenChanged] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  const token = hasAuthToken();

  const shouldFetchUser = !!token;
  const { user, isLoading, isError } = useCurrentUser({
    enabled: shouldFetchUser,
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsMounted(true);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const handleStorageChange = () => {
      setTokenChanged((prev) => prev + 1);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted) return;

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
    isMounted,
    pathname,
    token,
    user,
    isLoading,
    isError,
    router,
    tokenChanged,
  ]);

  if (!isMounted || (token && isLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  if (isPublicRoute || isAuthRoute) {
    return <>{children}</>;
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
