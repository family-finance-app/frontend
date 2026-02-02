'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useCurrentUser } from '@/api/auth/queries';
import { useAuth } from './AuthContext';
import Loader from '../Loader';

interface AuthGuardProps {
  children: React.ReactNode;
}

const PUBLIC_ROUTES = ['/'];
const AUTH_ROUTES = ['/sign-in', '/sign-up'];

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const id = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  const { user, isLoading, isError } = useCurrentUser({
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!isMounted) return;

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
    const isAuthRoute = AUTH_ROUTES.includes(pathname);
    const isProtectedRoute = !isPublicRoute && !isAuthRoute;

    if (isAuthRoute) {
      if (isAuthenticated && user && !isLoading && !isError) {
        router.replace('/dashboard');
      }
      return;
    }

    if (isProtectedRoute) {
      if (!isAuthenticated) {
        router.replace('/sign-in');
        return;
      }

      if (isLoading) {
        return;
      }

      if (isError || !user) {
        router.replace('/sign-in');
        return;
      }
    }
  }, [isMounted, pathname, isAuthenticated, user, isLoading, isError, router]);

  if (!isMounted || (isAuthenticated && isLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  if (isPublicRoute || isAuthRoute) {
    return <>{children}</>;
  }

  if (isAuthenticated && user && !isError) {
    return <>{children}</>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader />
    </div>
  );
}
