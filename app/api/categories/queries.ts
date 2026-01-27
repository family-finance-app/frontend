'use client';

import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-client';

import { Category } from '@/(main layout)/transactions/types';

import { useAuth } from '@/components/guards/AuthContext';
import { ApiSuccess, ApiError } from '../types';

// get all categories
export const useCategories = () => {
  const { token } = useAuth();

  const query = useQuery<ApiSuccess<Category[]>, ApiError>({
    queryKey: queryKeys.categories.all,
    queryFn: async () => {
      const resposne =
        await apiClient.get<ApiSuccess<Category[]>>('/categories');
      return resposne;
    },
    enabled: !!token,
  });

  return { categories: query.data?.data || [], ...query };
};
