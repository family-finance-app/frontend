// fetches transaction categories to be shown on "Create Transaction" component
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-client';

export interface Category {
  id: number;
  name: string;
  type: string;
  icon?: string;
  color?: string;
  createdAt: string;
}

// get all categories
export const useCategories = () => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: async (): Promise<Category[]> => {
      return apiClient.get<Category[]>('/api/categories', {
        token: token || undefined,
      });
    },
    enabled: !!token, // only run query if token exists
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
