// Creating, updating, and deleting transactions

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-client';

interface CreateTransactionData {
  accountId: number;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  amount: number;
  category: string;
  description?: string;
  date: string;
}

interface TransactionResponse {
  id: number;
  accountId: number;
  type: string;
  amount: number;
  category: string;
  description?: string;
  date: string;
  createdAt: string;
}

// create new transaction
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: CreateTransactionData
    ): Promise<TransactionResponse> => {
      const token = localStorage.getItem('authToken');

      return apiClient.post<TransactionResponse>('/api/transactions', data, {
        token: token || undefined,
      });
    },
    onSuccess: () => {
      // invalidate transactions and accounts (balance changed)
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
    },
  });
};

/**
 * Update existing transaction
 */
export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<CreateTransactionData>;
    }): Promise<TransactionResponse> => {
      const token = localStorage.getItem('authToken');

      return apiClient.put<TransactionResponse>(
        `/api/transactions/${id}`,
        data,
        { token: token || undefined }
      );
    },
    onSuccess: (data, variables) => {
      // Invalidate specific transaction, all transactions, and accounts
      queryClient.invalidateQueries({
        queryKey: queryKeys.transactions.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
    },
  });
};

/**
 * Delete transaction
 */
export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      const token = localStorage.getItem('authToken');

      return apiClient.delete<void>(`/api/transactions/${id}`, {
        token: token || undefined,
      });
    },
    onSuccess: (_, id) => {
      // Remove transaction from cache and invalidate related queries
      queryClient.removeQueries({
        queryKey: queryKeys.transactions.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
    },
  });
};
