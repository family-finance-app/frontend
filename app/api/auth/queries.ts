'use client';

import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-client';

import { getAuthToken } from '@/utils';
import { ApiError, ApiSuccess } from '../types';
import { CurrentUser } from '@/(auth)/types';

// get current authenticated user
export const useCurrentUser = () => {
  const token = getAuthToken();

  const query = useQuery<ApiSuccess<CurrentUser>, ApiError>({
    queryKey: queryKeys.auth.all,
    queryFn: async () => {
      const response = await apiClient.get<ApiSuccess<CurrentUser>>('/auth/me');
      return response;
    },
    enabled: !!token,
  });

  return { user: query.data?.data ?? undefined, ...query };
};
