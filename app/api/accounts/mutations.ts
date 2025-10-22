import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-client';
import { CreateAccountFormData, AccountResponse } from '@/types/account';

// create new user financial account
export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      formData: CreateAccountFormData
    ): Promise<AccountResponse> => {
      const token = localStorage.getItem('authToken');
      return apiClient.post<AccountResponse>(
        '/api/accounts/create',
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

// update existing account
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
      const token = localStorage.getItem('authToken');

      return apiClient.delete<void>(`/api/accounts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
