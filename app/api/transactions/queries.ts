'use client';

import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';

import { Transaction } from '@/(main layout)/transactions/types';

import { getAuthToken } from '@/utils';
import { ApiError, ApiSuccess } from '../types';
import { queryKeys } from '@/lib/query-client';

// get all transactions of a current user
export const useTransactions = () => {
  const token = getAuthToken();

  const query = useQuery<ApiSuccess<Transaction[]>, ApiError>({
    queryKey: queryKeys.transactions.all,
    queryFn: async () => {
      const response =
        await apiClient.get<ApiSuccess<Transaction[]>>('/transactions/all');
      return response;
    },
    enabled: !!token,
  });

  return { transactions: query.data?.data || [], ...query };
};
