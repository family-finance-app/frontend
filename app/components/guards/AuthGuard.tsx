'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { useCurrentUser } from '@/api/auth/queries';

import { getAuthToken } from '@/utils';

interface AuthGuardProps {
  children: React.ReactNode;
}

const PUBLIC_ROUTES = ['/'];
const AUTH_ROUTES = ['/sign-in', '/sign-up'];

export default function AuthGuard({ children }: AuthGuardProps) {
  // Ленивая инициализация - вызывается только один раз при создании компонента
  const [token, setToken] = useState<string | null>(() => getAuthToken());
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // Асинхронная установка isMounted
  useEffect(() => {
    const id = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  // Слушаем изменения в localStorage
  useEffect(() => {
    if (!isMounted) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken') {
        setToken(e.newValue);
      }
    };

    // Также слушаем custom event для изменений в том же окне
    const handleAuthChange = () => {
      setToken(getAuthToken());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChanged', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChanged', handleAuthChange);
    };
  }, [isMounted]);

  // Определяем, нужно ли загружать пользователя
  const shouldFetchUser = useMemo(() => !!token, [token]);

  const { user, isLoading, isError } = useCurrentUser({
    enabled: shouldFetchUser,
  });

  // Логика редиректов
  useEffect(() => {
    if (!isMounted) return;

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
    const isAuthRoute = AUTH_ROUTES.includes(pathname);
    const isProtectedRoute = !isPublicRoute && !isAuthRoute;

    console.log('🛡️ AuthGuard check:', {
      pathname,
      hasToken: !!token,
      hasUser: !!user,
      isLoading,
      isError,
    });

    // На auth страницах - если залогинен, редирект на dashboard
    if (isAuthRoute) {
      if (token && user && !isLoading && !isError) {
        console.log('🛡️ Redirecting from auth page to dashboard');
        router.replace('/dashboard');
      }
      return;
    }

    // На защищённых страницах
    if (isProtectedRoute) {
      if (!token) {
        console.log('🛡️ No token, redirecting to sign-in');
        router.replace('/sign-in');
        return;
      }

      // Ждём загрузки пользователя
      if (isLoading) {
        return;
      }

      // Если загрузка завершена, но юзера нет - редирект
      if (isError || !user) {
        console.log('🛡️ User load failed, redirecting to sign-in');
        router.replace('/sign-in');
        return;
      }
    }
  }, [isMounted, pathname, token, user, isLoading, isError, router]);

  // Показываем загрузку
  if (!isMounted || (token && isLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  // Публичные и auth роуты показываем сразу
  if (isPublicRoute || isAuthRoute) {
    return <>{children}</>;
  }

  // Защищённые роуты - только если есть токен и юзер
  if (token && user && !isError) {
    return <>{children}</>;
  }

  // Fallback
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg text-gray-600">Loading...</div>
    </div>
  );
}
