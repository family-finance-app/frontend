'use client';

// fetch current authenticated user

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-client';
import { User, UserResponse } from '@/types/profile';
import { getAuthToken } from '@/utils/token';

// get current user based on token sent to server with query parameters
export const useCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.auth.currentUser,
    queryFn: async (): Promise<User> => {
      const token = getAuthToken(); // Get token fresh each time
      if (!token) {
        throw new Error('No auth token');
      }
      const response = await apiClient.get<UserResponse>('/auth/me', {
        token: token,
      });
      return response.user;
    },
    enabled: !!getAuthToken(), // Check token fresh each time
    staleTime: 1000 * 60 * 10, // 10min
  });
};
