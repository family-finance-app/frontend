// fetch current authenticated user

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-client';
import { User } from '@/types/auth';

// get current user based on token sent to server with query parameters
export const useCurrentUser = () => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  return useQuery({
    queryKey: queryKeys.auth.currentUser,
    queryFn: async (): Promise<User> => {
      return apiClient.get<User>('/api/auth/me', {
        token: token || undefined,
      });
    },
    enabled: !!token, // endpoint responses with user data only if token exists
    staleTime: 1000 * 60 * 10, // 10min
  });
};
