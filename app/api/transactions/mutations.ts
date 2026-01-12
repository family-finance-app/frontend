'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-client';
import {
  CreateTransactionFormData,
  CreateTransferFormData,
  Transaction,
  TransactionResponse,
  UpdateTransactionFormData,
} from '@/(main layout)/transactions/types';
import { Account } from '@/(main layout)/accounts/types';
import { getAuthToken } from '@/utils/token';

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: CreateTransactionFormData
    ): Promise<Transaction> => {
      const token = getAuthToken();
      return apiClient.post<Transaction>('/transactions/create', data, {
        token: token || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.my });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.my });
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: UpdateTransactionFormData;
    }): Promise<Transaction> => {
      const token = getAuthToken();

      return apiClient.put<Transaction>(
        `/transactions/update`,
        {
          id,
          ...data,
        },
        {
          token: token || undefined,
        }
      );
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.transactions.detail(String(variables.id)),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.my });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.my });
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      const token = getAuthToken();

      try {
        await apiClient.delete<void>(`/transactions/delete/${id}`, {
          token: token || undefined,
        });
      } catch (error) {
        const err = error as any;
        console.error('Delete error details:', err);
        throw new Error(
          err?.message ||
            err?.error ||
            'Failed to delete transaction. Please try again.'
        );
      }
    },
    onSuccess: (_, id) => {
      queryClient.removeQueries({
        queryKey: queryKeys.transactions.detail(String(id)),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.my });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
    },
    onError: (error: any) => {
      console.error('Delete transaction error:', error);
    },
  });
};

export const useCreateTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: CreateTransferFormData
    ): Promise<TransactionResponse> => {
      const token = getAuthToken();
      return apiClient.post<TransactionResponse>(
        '/transactions/transfer',
        data,
        {
          token: token || undefined,
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.my });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.my });
    },
  });
};
