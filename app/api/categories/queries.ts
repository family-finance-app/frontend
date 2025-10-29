// get categories list for different purposes

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-client';
import { Category } from '@/types/transaction';
import { getAuthToken } from '@/utils/token';

// get all categories
export const useCategories = () => {
  const token = getAuthToken();

  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: async (): Promise<Category[]> => {
      return apiClient.get<Category[]>('/api/categories', {
        token: token || undefined,
      });
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // 5min
  });
};
