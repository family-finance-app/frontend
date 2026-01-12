'use client';

// create, update, or delete FINANCIAL accounts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-client';
import { Account, CreateAccountFormData } from '@/(main layout)/accounts/types';
import { getAuthToken } from '@/utils/token';

// create new account (card, cash etc)
export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: CreateAccountFormData): Promise<Account> => {
      const token = getAuthToken();
      return apiClient.post<Account>(
        '/accounts/create',
        {
          name: formData.name,
          type: formData.type,
          balance: formData.balance,
          currency: formData.currency,
        },
        { token: token || undefined }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.my });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
    },
  });
};

// update account
export const useUpdateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<CreateAccountFormData>;
    }): Promise<Account> => {
      const token = getAuthToken();
      return apiClient.put<Account>(`/accounts/${id}`, data, {
        token: token || undefined,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.accounts.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.my });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
    },
  });
};

// delete account
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      const token = getAuthToken();
      return apiClient.delete<void>(`/accounts/${id}`, {
        token: token || undefined,
      });
    },
    onSuccess: (_, id) => {
      queryClient.removeQueries({
        queryKey: queryKeys.accounts.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.my });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
    },
  });
};
