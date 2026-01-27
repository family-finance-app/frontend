'use client';

import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-client';

import { getAuthToken } from '@/utils';
import { ApiError, ApiSuccess } from '../types';
import { CurrentUser } from '@/(auth)/types';
import { hasAuthToken } from '@/utils';

// get current authenticated user
export const useCurrentUser = (options?: { enabled?: boolean }) => {
  const query = useQuery<ApiSuccess<CurrentUser>, ApiError>({
    queryKey: queryKeys.auth.currentUser,
    queryFn: async () => {
      const response = await apiClient.get<ApiSuccess<CurrentUser>>('/auth/me');
      return response;
    },
    enabled: options?.enabled ?? true,
    retry: false, // НЕ повторяем при 401
    staleTime: 1000 * 60 * 5, // 5 минут
    gcTime: 1000 * 60 * 10, // 10 минут
    // При ошибке НЕ храним старые данные
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  return { user: query.data?.data ?? undefined, ...query };
};
