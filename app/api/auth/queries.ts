// fetching current user data

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-client';

interface User {
  id: number;
  email: string;
  role: string;
}

// GET current authenticated user
export const useCurrentUser = () => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  return useQuery({
    queryKey: queryKeys.auth.currentUser,
    queryFn: async (): Promise<User> => {
      return apiClient.get<User>('/auth/me', { token: token || undefined });
    },
    enabled: !!token, // only run query if token exists
    staleTime: 1000 * 60 * 10,
  });
};
