// Creating, updating, and deleting transactions

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-client';
import type { Transaction, TransactionResponse } from '@/types/transaction';
import type { Account } from '@/types/account';

export interface CreateTransactionData {
  accountId: number;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  amount: number;
  categoryId: number;
  currency: 'UAH' | 'USD' | 'EUR';
  date: string;
  description?: string;
  groupId?: number;
}

// create new transaction
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTransactionData): Promise<Transaction> => {
      const token = localStorage.getItem('authToken');

      const response = await apiClient.post<TransactionResponse | Transaction>(
        '/api/transactions/create',
        data,
        {
          token: token || undefined,
        }
      );
      if (
        response &&
        typeof response === 'object' &&
        'transaction' in response
      ) {
        return (response as TransactionResponse).transaction;
      }
      return response as Transaction;
    },
    onMutate: async (newTx) => {
      // Optimistic update: adjust account balance in cache based on transaction type
      await queryClient.cancelQueries({ queryKey: queryKeys.accounts.my });
      const prevAccounts = queryClient.getQueryData<Account[]>(
        queryKeys.accounts.my
      );
      const prevDetail = queryClient.getQueryData<Account>(
        queryKeys.accounts.detail(newTx.accountId)
      );

      const sign =
        newTx.type === 'INCOME' ? 1 : newTx.type === 'EXPENSE' ? -1 : 0;
      const delta = sign * Number(newTx.amount || 0);

      if (prevAccounts) {
        const updatedAccounts = prevAccounts.map((acc) =>
          acc.id === newTx.accountId
            ? { ...acc, balance: Number(acc.balance) + delta }
            : acc
        );
        queryClient.setQueryData(queryKeys.accounts.my, updatedAccounts);
      }

      if (prevDetail && prevDetail.id === newTx.accountId) {
        const updatedDetail = {
          ...prevDetail,
          balance: Number(prevDetail.balance) + delta,
        } as Account;
        queryClient.setQueryData(
          queryKeys.accounts.detail(newTx.accountId),
          updatedDetail
        );
      }

      return { prevAccounts, prevDetail } as {
        prevAccounts?: Account[];
        prevDetail?: Account;
      };
    },
    onError: (_err, _newTx, ctx) => {
      // Rollback optimistic update on error
      if (ctx?.prevAccounts) {
        queryClient.setQueryData(queryKeys.accounts.my, ctx.prevAccounts);
      }
      if (ctx?.prevDetail) {
        queryClient.setQueryData(
          queryKeys.accounts.detail(ctx.prevDetail.id),
          ctx.prevDetail
        );
      }
    },
    onSuccess: () => {
      // invalidate transactions and accounts (balance changed)
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.my });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.my });
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
    }): Promise<Transaction> => {
      const token = localStorage.getItem('authToken');

      const response = await apiClient.put<TransactionResponse | Transaction>(
        `/api/transactions/${id}`,
        data,
        { token: token || undefined }
      );
      if (
        response &&
        typeof response === 'object' &&
        'transaction' in response
      ) {
        return (response as TransactionResponse).transaction;
      }
      return response as Transaction;
    },
    onSuccess: (data, variables) => {
      // Invalidate specific transaction, all transactions, and accounts
      queryClient.invalidateQueries({
        queryKey: queryKeys.transactions.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.my });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.my });
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
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.my });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
    },
  });
};
