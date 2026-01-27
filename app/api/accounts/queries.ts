'use client';

import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-client';

import { Account } from '@/(main layout)/accounts/types';

import { useAuth } from '@/components/guards/AuthContext';
import { ApiError, ApiSuccess } from '../types';

// get all user accounts info
export const useMyAccounts = () => {
  const { token } = useAuth();

  const query = useQuery<ApiSuccess<Account[]>, ApiError>({
    queryKey: queryKeys.accounts.all,

    queryFn: async () => {
      const response =
        await apiClient.get<ApiSuccess<Account[]>>('/accounts/my');
      return response;
    },
    enabled: !!token,
  });

  return { accounts: query.data?.data || [], ...query };
};
