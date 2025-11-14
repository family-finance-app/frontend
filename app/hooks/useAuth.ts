'use client';

import { useCurrentUser } from '@/api/auth/queries';
import { hasAuthToken } from '@/utils/token';

export const useAuth = () => {
  const { data: user, isLoading, isError } = useCurrentUser();
  const token = hasAuthToken();

  return {
    user,
    isAuthenticated: !!token && !!user && !isError,
    isLoading,
    isError,
    hasToken: !!token,
  };
};
