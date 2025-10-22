// fetching current user data

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-client';
import { User } from '@/types/auth';

interface CurrentUserResponse {
  message: string;
  user: User;
}

// GET current authenticated user
export const useCurrentUser = () => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  return useQuery({
    queryKey: queryKeys.auth.currentUser,
    queryFn: async (): Promise<User> => {
      const response = await apiClient.get<CurrentUserResponse>(
        '/api/auth/me',
        {
          token: token || undefined,
        }
      );
      if (response && typeof response === 'object' && 'user' in response) {
        return response.user;
      }
      return response as unknown as User;
    },
    enabled: !!token, // only run query if token exists
    staleTime: 1000 * 60 * 10,
  });
};
