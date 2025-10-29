/**
 * Transaction queries
 * Handles fetching transaction data
 */

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-client';

interface Transaction {
  id: number;
  accountId: number;
  type: string;
  amount: number;
  categoryId: string;
  description?: string;
  date: string;
  createdAt: string;
}

// get all transactions
export const useTransactions = () => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  return useQuery({
    queryKey: queryKeys.transactions.all,
    queryFn: async (): Promise<Transaction[]> => {
      return apiClient.get<Transaction[]>('/api/transactions', {
        token: token || undefined,
      });
    },
    enabled: !!token,
  });
};

// get a transaction by id
export const useTransaction = (id: number) => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  return useQuery({
    queryKey: queryKeys.transactions.detail(id),
    queryFn: async (): Promise<Transaction> => {
      return apiClient.get<Transaction>(`/api/transactions/${id}`, {
        token: token || undefined,
      });
    },
    enabled: !!token && !!id,
  });
};

/**
 * Get transactions by account ID
 */
export const useTransactionsByAccount = (accountId: number) => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  return useQuery({
    queryKey: queryKeys.transactions.byAccount(accountId),
    queryFn: async (): Promise<Transaction[]> => {
      return apiClient.get<Transaction[]>(
        `/api/transactions?accountId=${accountId}`,
        { token: token || undefined }
      );
    },
    enabled: !!token && !!accountId,
  });
};

/**
 * Get user's transactions
 */
export const useMyTransactions = () => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  return useQuery({
    queryKey: queryKeys.transactions.my,
    queryFn: async (): Promise<Transaction[]> => {
      return apiClient.get<Transaction[]>('/api/transactions/all', {
        token: token || undefined,
      });
    },
    enabled: !!token,
  });
};

/**
 * Get family transactions
 */
export const useFamilyTransactions = () => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  return useQuery({
    queryKey: queryKeys.transactions.family,
    queryFn: async (): Promise<Transaction[]> => {
      return apiClient.get<Transaction[]>('/api/transactions/family', {
        token: token || undefined,
      });
    },
    enabled: !!token,
  });
};
