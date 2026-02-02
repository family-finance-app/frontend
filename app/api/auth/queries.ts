'use client';

import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-client';

import { useAuth } from '@/components/guards/AuthContext';
import { ApiError, ApiSuccess } from '../types';
import { CurrentUser } from '@/(auth)/types';

// get current authenticated user
export const useCurrentUser = (options?: { enabled?: boolean }) => {
  const { token } = useAuth();
  const query = useQuery<ApiSuccess<CurrentUser>, ApiError>({
    queryKey: queryKeys.auth.currentUser,
    queryFn: async () => {
      const response = await apiClient.get<ApiSuccess<CurrentUser>>('/auth/me');
      return response;
    },
    enabled: options?.enabled ?? !!token,
    retry: false,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  return { user: query.data?.data ?? undefined, ...query };
};
