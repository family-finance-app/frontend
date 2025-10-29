// create, update, and delete transactions

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-client';
import type {
  CreateTransactionFormData,
  Transaction,
} from '@/types/transaction';
import type { Account } from '@/types/account';
import { getAuthToken } from '@/utils/token';

// create new transaction
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      data: CreateTransactionFormData
    ): Promise<Transaction> => {
      const token = getAuthToken();

      return apiClient.post<Transaction>('/api/transactions/create', data, {
        token: token || undefined,
      });
    },
    onMutate: async (newTx) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.accounts.my });
      const prevAccounts = queryClient.getQueryData<Account[]>(
        queryKeys.accounts.my
      );
      const accountId = String(newTx.accountId);
      const prevDetail = queryClient.getQueryData<Account>(
        queryKeys.accounts.detail(accountId)
      );

      const sign =
        newTx.type === 'INCOME' ? 1 : newTx.type === 'EXPENSE' ? -1 : 0;
      const delta = sign * Number(newTx.amount || 0);

      if (prevAccounts) {
        const updatedAccounts = prevAccounts.map((acc) =>
          String(acc.id) === accountId
            ? { ...acc, balance: Number(acc.balance) + delta }
            : acc
        );
        queryClient.setQueryData(queryKeys.accounts.my, updatedAccounts);
      }

      if (prevDetail && String(prevDetail.id) === accountId) {
        const updatedDetail = {
          ...prevDetail,
          balance: Number(prevDetail.balance) + delta,
        } as Account;
        queryClient.setQueryData(
          queryKeys.accounts.detail(accountId),
          updatedDetail
        );
      }

      return { prevAccounts, prevDetail } as {
        prevAccounts?: Account[];
        prevDetail?: Account;
      };
    },
    onError: (_err, _newTx, ctx) => {
      if (ctx?.prevAccounts) {
        queryClient.setQueryData(queryKeys.accounts.my, ctx.prevAccounts);
      }
      if (ctx?.prevDetail) {
        queryClient.setQueryData(
          queryKeys.accounts.detail(String(ctx.prevDetail.id)),
          ctx.prevDetail
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.my });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.my });
    },
  });
};

// update existing transaction
export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<CreateTransactionFormData>;
    }): Promise<Transaction> => {
      const token = getAuthToken();

      return apiClient.put<Transaction>(
        `/api/transactions/update`,
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

// delete transaction
export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      const token = getAuthToken();

      try {
        await apiClient.delete<void>(`/api/transactions/delete/${id}`, {
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
