'use client';

// get categories list for different purposes

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-client';
import { Category } from '@/types/category';
import { getAuthToken } from '@/utils/token';
import { useEffect, useState } from 'react';

// get all categories
export const useCategories = () => {
  const token = getAuthToken();

  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: async (): Promise<Category[]> => {
      return apiClient.get<Category[]>('/categories', {
        token: token || undefined,
      });
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // 5min
  });
};
