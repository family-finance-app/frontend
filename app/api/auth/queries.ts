'use client';

// fetch current authenticated user

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-client';
import { User, UserResponse } from '@/types/profile';
import { getAuthToken } from '@/utils/token';
import { useEffect, useState } from 'react';

// get current user based on token sent to server with query parameters
export const useCurrentUser = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setToken(getAuthToken());
  }, []);

  return useQuery({
    queryKey: queryKeys.auth.currentUser,
    queryFn: async (): Promise<User> => {
      const response = await apiClient.get<UserResponse>('/api/auth/me', {
        token: token || undefined,
      });
      return response.user;
    },
    enabled: !!token && isClient,
    staleTime: 1000 * 60 * 10, // 10min
  });
};
