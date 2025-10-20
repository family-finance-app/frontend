/**
 * Account queries
 * Handles fetching account data
 */

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-client';
import { AccountResponse } from '@/types/account';

/**
 * Get all accounts
 */
export const useAccounts = () => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  return useQuery({
    queryKey: queryKeys.accounts.all,
    queryFn: async (): Promise<AccountResponse[]> => {
      return apiClient.get<AccountResponse[]>('/api/accounts', {
        token: token || undefined,
      });
    },
    enabled: !!token,
  });
};

/**
 * Get single account by ID
 */
export const useAccount = (id: number) => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  return useQuery({
    queryKey: queryKeys.accounts.detail(id),
    queryFn: async (): Promise<AccountResponse> => {
      return apiClient.get<AccountResponse>(`/api/accounts/${id}`, {
        token: token || undefined,
      });
    },
    enabled: !!token && !!id,
  });
};

/**
 * Get accounts by user ID
 */
export const useAccountsByUser = (userId: number) => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  return useQuery({
    queryKey: queryKeys.accounts.byUser(userId),
    queryFn: async (): Promise<AccountResponse[]> => {
      return apiClient.get<AccountResponse[]>(
        `/api/accounts?userId=${userId}`,
        { token: token || undefined }
      );
    },
    enabled: !!token && !!userId,
  });
};
