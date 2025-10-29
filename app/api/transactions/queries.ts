'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Transaction } from '@/types/transaction';
import { getAuthToken } from '@/utils/token';

const queryKeys = {
  transactions: {
    all: ['transactions'],
    lists: () => [...queryKeys.transactions.all, 'list'],
    list: (filters: Record<string, any>) => [
      ...queryKeys.transactions.lists(),
      filters,
    ],
    details: () => [...queryKeys.transactions.all, 'detail'],
    detail: (id: string) => [...queryKeys.transactions.details(), id],
    byAccount: (accountId: string) => [
      ...queryKeys.transactions.lists(),
      'byAccount',
      accountId,
    ],
    my: ['transactions', 'my'],
    family: ['transactions', 'family'],
  },
};

// get all transactions
export const useTransactions = () => {
  const token = getAuthToken();

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
export const useTransaction = (id: string) => {
  const token = getAuthToken();

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
export const useTransactionsByAccount = (accountId: string) => {
  const token = getAuthToken();

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

// get the current user's transactions
export const useMyTransactions = () => {
  const token = getAuthToken();

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

// get family transactions
export const useFamilyTransactions = () => {
  const token = getAuthToken();

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
