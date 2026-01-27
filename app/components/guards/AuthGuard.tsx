'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useCurrentUser } from '@/api/auth/queries';
import { useAuth } from './AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
}

const PUBLIC_ROUTES = ['/'];
const AUTH_ROUTES = ['/sign-in', '/sign-up'];

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Используем централизованный AuthContext
  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    const id = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  // Загружаем пользователя только если есть токен
  const { user, isLoading, isError, refetch } = useCurrentUser({
    enabled: isAuthenticated,
  });

  // Принудительный refetch при изменении токена
  useEffect(() => {
    if (isAuthenticated && isMounted) {
      console.log('🛡️ Token changed, refetching user');
      refetch();
    }
  }, [token, isAuthenticated, isMounted, refetch]);

  // Логика редиректов
  useEffect(() => {
    if (!isMounted) return;

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
    const isAuthRoute = AUTH_ROUTES.includes(pathname);
    const isProtectedRoute = !isPublicRoute && !isAuthRoute;

    console.log('🛡️ AuthGuard check:', {
      pathname,
      isAuthenticated,
      hasUser: !!user,
      isLoading,
      isError,
    });

    // На auth страницах
    if (isAuthRoute) {
      if (isAuthenticated && user && !isLoading && !isError) {
        console.log('🛡️ Redirecting to dashboard');
        router.replace('/dashboard');
      }
      return;
    }

    // На защищённых страницах
    if (isProtectedRoute) {
      if (!isAuthenticated) {
        console.log('🛡️ Not authenticated, redirecting to sign-in');
        router.replace('/sign-in');
        return;
      }

      if (isLoading) {
        console.log('🛡️ Loading user data...');
        return;
      }

      if (isError || !user) {
        console.log('🛡️ User load failed, redirecting to sign-in');
        router.replace('/sign-in');
        return;
      }
    }
  }, [isMounted, pathname, isAuthenticated, user, isLoading, isError, router]);

  // Показываем загрузку
  if (!isMounted || (isAuthenticated && isLoading)) {
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

  if (isAuthenticated && user && !isError) {
    return <>{children}</>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg text-gray-600">Loading...</div>
    </div>
  );
}
