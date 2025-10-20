/**
 * Account mutations
 * Handles creating, updating, and deleting accounts
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-client';
import { CreateAccountFormData, AccountResponse } from '@/types/account';

/**
 * Create new account
 */
export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      formData: CreateAccountFormData
    ): Promise<AccountResponse> => {
      const token = localStorage.getItem('authToken');

      return apiClient.post<AccountResponse>(
        '/api/accounts',
        {
          title: formData.title,
          type: formData.type,
          balance: formData.balance,
          currency: formData.currency,
          createdBy: 1, // TODO: get from auth context
          userId: 1, // TODO: get from auth context
        },
        { token: token || undefined }
      );
    },
    onSuccess: () => {
      // Invalidate all accounts queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
    },
  });
};

/**
 * Update existing account
 */
export const useUpdateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<CreateAccountFormData>;
    }): Promise<AccountResponse> => {
      const token = localStorage.getItem('authToken');

      return apiClient.put<AccountResponse>(`/api/accounts/${id}`, data, {
        token: token || undefined,
      });
    },
    onSuccess: (data, variables) => {
      // Invalidate specific account and all accounts list
      queryClient.invalidateQueries({
        queryKey: queryKeys.accounts.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
    },
  });
};

/**
 * Delete account
 */
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      const token = localStorage.getItem('authToken');

      return apiClient.delete<void>(`/api/accounts/${id}`, {
        token: token || undefined,
      });
    },
    onSuccess: (_, id) => {
      // Remove account from cache and invalidate accounts list
      queryClient.removeQueries({
        queryKey: queryKeys.accounts.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
    },
  });
};
